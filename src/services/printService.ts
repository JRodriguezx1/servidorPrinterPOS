import path, { join } from 'path';
import  fs from 'fs/promises';  //modulo de archivos con mejora asincrona
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { IPrintService, ListPrintersResponse, Print, DevicePOS, PrintResponse } from "types/PrintTypes";
import { ThermalPrinter, PrinterTypes, CharacterSet } from "node-thermal-printer";

//import { Printer } from '@node-escpos/core';
//import USB from '@node-escpos/usb-adapter';

//escpos.USB = USB;

interface PrintJob {
    id:string,
    build: (printer: ThermalPrinter)=>void,  //el campo build es una funcion
    resolve: (value: PrintResponse)=>void,
    reject: (reason: any)=>void,
}

export class printService implements IPrintService{

    private queue: PrintJob[] = []; //[{ campo: funcion() }, {}...]
    private isPrinting = false;
    protected filePath:string = path.join(process.cwd(), 'temp');
    protected execPromise = promisify(exec);


    async list(): Promise<any> {

        let printer = new ThermalPrinter({
            type: PrinterTypes.EPSON,  // O PrinterTypes.STAR
            interface: path.join(this.filePath, 'ticket.bin'), // El nombre en el Panel de Control
            characterSet: CharacterSet.PC852_LATIN2, // Configuración de acentos/eñes
            removeSpecialCharacters: false,
        });
        //return printer;


        //Diseñamos el ticket 
        printer.alignCenter(); 
        printer.bold(true);
        printer.setTextSize(2, 2);
        printer.println("MI NEGOCIO\n"); 
        printer.bold(false);
        printer.setTextSize(1, 1);
        printer.alignLeft();
        printer.println("Calle Falsa 123\n"); 
        printer.drawLine(); 
        printer.alignLeft(); 
        printer.println("Producto Total\n"); 
        printer.newLine();
        printer.println("Hamb. Doble $10.00\n"); 
        printer.cut();
        // Abrir el cajón monedero
        //printer.openCashDrawer();



        try {
            await fs.mkdir(this.filePath, {recursive:true}); // Si ya existe la carpeta, no pasa nada (gracias a recursive: true)
            await printer.execute();
            const ticketFile = path.join(this.filePath, 'ticket.bin');
            const printerPath = "\\\\localhost\\CAJA";

            await this.execPromise(`cmd /c copy /b "${ticketFile}" "${printerPath}"`);

        } catch (er) {
            console.log('Error crítico en el proceso de impresión>>', er);
        }

        //const device = new USB(0x0471, 0x0055);
        /*try {
            const device = new USB(0x0471, 0x0055);
            const dispositivos = escpos.USB.findPrinter();
            console.log(dispositivos);
            const list = dispositivos.map((device:any, index:number) => ({
                    id: index,
                    vendorId: device.deviceDescriptor.idVendor,
                    productId: device.deviceDescriptor.idProduct,
                    nombre: `Impresora POS ${index + 1}`,
                    conectada: true
            }));
            return {
                ok: true,
                data: list
            };
        }catch (error) {
            return {
                ok: false,
                data: [],
                message: '❌ Error listando dispositivos: '+error
            };
        }*/
    }

    async ticket1(): Promise<PrintResponse>{

        return new Promise((resolve, reject)=>{
            this.addToQueue((printer)=>{  //guarda funcion con el diseño del ticket
                //Diseñamos el ticket 
                printer.alignCenter(); 
                printer.bold(true);
                printer.setTextSize(2, 2);
                printer.println("MI NEGOCIO\n"); 
                printer.bold(false);
                printer.setTextSize(1, 1);
                printer.alignLeft();
                printer.println("Calle Falsa 123\n"); 
                printer.drawLine(); 
                printer.alignLeft(); 
                printer.println("Producto Total\n"); 
                printer.newLine();
                printer.println("Hamb. Doble $10.00\n"); 
                printer.cut();
            }, resolve, reject); //pasamos la promesa
        });
        
        
    }


    //Funcion para añadir a cola, addToQueue ahora acepta los callbacks de la promesa 3 parametros como funciones
    private addToQueue(builder: (printer: ThermalPrinter)=>void, resolve: (value: PrintResponse)=>void, reject: (reason: any)=>void):PrintJob{
        const job:PrintJob = { 
            id: Date.now()+'', 
            build: builder,
            resolve,  //se guarda la referencia a la funcion resolve
            reject 
        };
        this.queue.push(job); //en el campo build guarda funcion con el diseño del ticket y los callbacks de las promesas
        this.processQueue();
        return job;
    }


    private async processQueue() {

        if (this.isPrinting || this.queue.length === 0) return;
        this.isPrinting = true;

        const job = this.queue.shift();
        if (!job) {
            this.isPrinting = false;
            return;
        }

        const ticketFile = path.join(this.filePath, `ticket-${job.id}.bin`);
        const printerPath = "\\\\localhost\\CAJA";

        try {
            let printer = new ThermalPrinter({
                    type: PrinterTypes.EPSON,  // O PrinterTypes.STAR
                    interface: path.join(this.filePath, `ticket-${job.id}.bin`), 
                    characterSet: CharacterSet.PC852_LATIN2, // Configuración de acentos/eñes
                    removeSpecialCharacters: false,
                });

            job.build(printer); //ejecuta la funcion guardada
            await fs.mkdir(this.filePath, {recursive:true}); // Si ya existe la carpeta, no pasa nada (gracias a recursive: true)
            await printer.execute();
            await this.execPromise(`cmd /c copy /b "${ticketFile}" "${printerPath}"`);
            await fs.unlink(ticketFile);

            // --- ÉXITO ---
            job.resolve({  //Llamamos a la función resolve que guardamos antes y le pasamos PrintResponse
                ok: true,
                jobId: job.id,
                message: 'Impresión física completada',
                timestamp: new Date()
            });

        } catch (er) {
            console.log('Error crítico en el proceso de impresión>>', er);
            await fs.unlink(ticketFile);
                job.resolve({ // Resolvemos con ok: false para indicar fallo controlado
                ok: false,
                jobId: job.id,
                message: `Error: ${er}`,
                timestamp: new Date()
            });
        }

        this.isPrinting = false;
        // 🔥 procesa siguiente automáticamente
        this.processQueue();
    }



    async printPOS(print: Print): Promise<any> {

        /*const device = new escpos.USB(0x0471, 0x0055);
        const printer = new escpos.Printer(device);
        //const dispositivos = escpos.USB.findPrinter();
        
        return new Promise((resolve, reject) => {

            device.open((err: any) => {
            if (err) {
                return resolve({ ok: false, message: "Error abriendo impresora" });
            }

            printer
                .align("ct")
                .text("MI POS")
                .drawLine()
                .text("mi negocio")
                .cut()
                .close();

            resolve({ ok: true });
            });

        });*/
       
    }
}