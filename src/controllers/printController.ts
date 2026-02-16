import { printService } from "@services/printService";
import { IPrintService, Print } from "types/PrintTypes";
import { Request, Response } from "express";


const printerService:IPrintService = new printService();

export class printController {

    static list  = async(req:Request, res:Response)=>{
        const devices = await printerService.list();
        res.json(devices);
    }

    static ticket1  = async(req:Request, res:Response)=>{
        const response = await printerService.ticket1();
        res.json(response);
    }

    static printTicket  = async(req:Request, res:Response)=>{
        const lineas:Print = req.body;
        const devices =  await printerService.list();
        if(devices.ok){
            const device = await printerService.printPOS(lineas);
            res.json(device);
        }
    }
}