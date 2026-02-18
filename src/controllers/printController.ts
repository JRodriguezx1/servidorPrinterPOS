import { printService } from "@services/printService";
import { IPrintService, Print } from "types/PrintTypes";
import { Request, Response } from "express";


const printerService:IPrintService = new printService();

export class printController {

    static list  = async(req:Request, res:Response)=>{
        const devices = await printerService.list();
        res.json(devices);
    }


    static listPrinter = async(req:Request, res:Response)=>{
        const list = await printerService.listPrinter();
        res.json(list);
    }

    static testPrinter = async(req:Request, res:Response)=>{
        const {nameShare} = req.params;
        if(Array.isArray(nameShare))return res.status(400).json({ message: "Nombre compartido inválido" });
        const response = await printerService.testPrinter(nameShare);
        res.json(response);
    }

    static viewLog = async(req:Request, res:Response)=>{
        const log = await printerService.viewLog();
        res.json(log);
    }

    static ticket1  = async(req:Request, res:Response)=>{
        try {
            const response = await printerService.ticket1();
            res.json(response);
        } catch (error) {
            res.json(error);
            console.log(error);
        }
    }

    static openCashDrawer = async(req:Request, res:Response)=>{
        const response = await printerService.openCashDrawer();
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