import { Request, Response } from "express";
//import { cuentaService } from "@services/cuentaService";
import { Cuenta, ICuentaService } from "types/CuentasTypes";
//import { cuentaRepository } from "@repositories/cuentaRepository";
import { brokerClient, instanceCuentaService } from "@dependencies/dependencies";



//const instanceCuentaService:ICuentaService = new cuentaService(new cuentaRepository);

export class cuentaController {

    static createCuenta = async(req:Request, res:Response)=>{
        const cuenta:Cuenta = req.body;
        try {
            const response:Cuenta = await instanceCuentaService.createCuenta(cuenta);
            const reg = await brokerClient.refreshRegistration();
            res.status(200).json({cuenta: response, registered: reg});
        } catch (error) {
            console.log('error >>', error);
            res.status(400).json({ valido:false, message: (error as Error).message || "Error al crear cuenta" });
        }
    }


    //esta ruta viene de index.ts y es autoejecutada para obtener datos de la cuenta
    static getCuenta = async(req:Request, res:Response)=>{  
        try {
            const cuenta = await instanceCuentaService.getCuenta();
            if (!cuenta) return res.status(404).json({ valido:false, message: "Cuenta no encontrada o no existe en DB" });
            res.status(200).json({ valido:true, data:cuenta });
        } catch (error) {
            console.log('error >>', error);
            res.status(500).json({ valido:false, message: (error as Error).message || "Error interno del servidor"});
        }
    }

    //valida el estado de la conexión con el broker y del registro, esta ruta es consultada periódicamente desde index.ts
    static getStatus = async(req:Request, res:Response)=>{
        res.status(200).json({status: brokerClient.getStatus.status, registered: brokerClient.getStatus.registered});
    }


    static restartConnection = async(req:Request, res:Response)=>{
        brokerClient.restartConnection();
        res.status(200).json({message:"Reconexión iniciada"});
    }
    
}