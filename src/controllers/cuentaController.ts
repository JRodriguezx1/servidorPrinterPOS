import { Request, Response } from "express";
import { cuentaService } from "@services/cuentaService";
import { Cuenta, ICuentaService } from "types/CuentasTypes";
import { cuentaRepository } from "@repositories/cuentaRepository";


const instanceCuentaService:ICuentaService = new cuentaService(new cuentaRepository);

export class cuentaController {

    static createCuenta = async(req:Request, res:Response)=>{
        const cuenta:Cuenta = req.body;
        try {
            const response:Cuenta = await instanceCuentaService.createCuenta(cuenta);
            res.status(200).json(response);
        } catch (error) {
            console.log('error >>', error);
            res.status(400).json({ valido:false, message: (error as Error).message || "Error al crear cuenta" });
        }
    }


    static getCuenta = async(req:Request, res:Response)=>{
        const cuenta = await instanceCuentaService.getCuenta();
        if (!cuenta) return res.status(404).json({ valido:false, message: "Cuenta no encontrada" });
        res.status(200).json(cuenta);
    }
    
}