import { Request, Response } from "express";
import { fileService } from "@services/fileService";
import { IFileService } from "types/filesTypes";
import { cuentaService } from "@services/cuentaService";
import { Cuenta, ICuentaService } from "types/CuentasTypes";
import { cuentaRepository } from "@repositories/cuentaRepository";

const instanceCuentaService:ICuentaService = new cuentaService(new cuentaRepository);
const fileServiceInstance:IFileService = new fileService();

export class fileController {


    static downloadFileLogo = async(req:Request, res:Response)=>{
        try {
            const cuenta:Cuenta|null = await instanceCuentaService.getCuenta();
            if (!cuenta)
                return res.status(404).json({ valido:false, message: "Cuenta no encontrada" });
            await fileServiceInstance.downloadFileLogo(cuenta.nombreCuenta);
            return res.json({message:"Archivo descargado correctamente"});
        } catch (error) {
            console.error(error);
            res.status(500).json({message:"Error al descargar el archivo"});
        }

    }
}