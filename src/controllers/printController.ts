import { Request, Response } from "express";
import { printService } from "@services/printService";
import { IPrintService, Print, PrintResponse } from 'types/PrintTypes';


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
        const {nameShare} = req.params;
        if(Array.isArray(nameShare))return res.status(400).json({ message: "Nombre compartido inválido" });
        try {
            console.log(req.body);
            const response = await printerService.ticket1(nameShare, req.body);
            res.json(response);
        } catch (error) {
            res.json(error);
            console.log(error);
        }
    }

    static openCashDrawer = async(req:Request, res:Response)=>{
        const {nameShare} = req.params;
        if(Array.isArray(nameShare))return res.status(400).json({ message: "Nombre compartido inválido" });
        const response = await printerService.openCashDrawer(nameShare);
        res.json(response);
    }

    static statushardware = async(req:Request, res:Response)=>{
        const {nameShare} = req.params;
        if(Array.isArray(nameShare))return res.status(400).json({ message: "Nombre compartido inválido" });
        const response:PrintResponse = await printerService.statushardware(nameShare);
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