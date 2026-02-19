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

    private bufferLog:PrintResponse[] = [];
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
    }


    //LISTAR TODAS LAS IMPRESORAS
    public async listPrinter(): Promise<ListPrintersResponse> {
        try {
            const {stdout} = await this.execPromise('powershell -Command "Get-CimInstance -ClassName Win32_Printer | Where-Object { $_.Shared -eq $true } | Select-Object Name, ShareName | ConvertTo-Json"');
            let printer = JSON.parse(stdout);
            if(!Array.isArray(printer))printer = [printer];
            if(printer.length>0){
                return {
                    ok: true,
                    data: printer,
                    message: 'Dispositivos compartidos: ',
                };
            }else{
                return {
                    ok: false,
                    data: [],
                    message: 'No hay dispositivos compartidos.',
                };
            }
        } catch (error) {
            return {
                ok: false,
                data: [],
                message: '❌ Error listando dispositivos: ',
            };
        }
    }


    //TEST DE IMPRESION
    public async testPrinter(nameShare:string): Promise<PrintResponse>{
        return new Promise((resolve, reject)=>{
            this.addToQueue((printer)=>{  //guarda funcion con el diseño del ticket
                printer.alignCenter(); 
                printer.bold(true);
                printer.setTextSize(2, 2);
                printer.println("PRUEBA DE IMPRESION\n"); 
                printer.bold(false);
                printer.setTextSize(1, 1);
                printer.alignLeft();
                printer.println("Servidor de impresion node - v1.0.0\n"); 
                printer.drawLine(); 
                printer.alignLeft(); 
                printer.println("Test de impresion basico\n"); 
                printer.newLine();
                printer.println("J2 Software POS Multisucursal.\n"); 
                printer.cut();
            }, resolve, reject, nameShare); //pasamos la promesa
        });
    }


    //VISUALIZAR ESTADO DE ULTIMA IMPRESION
    public async viewLog():Promise<PrintResponse|null>{
        if(this.bufferLog.length>0)
            return this.bufferLog[0];
        return null;
    }



    async ticket1(): Promise<PrintResponse>{
        return new Promise((resolve, reject)=>{
            /*this.addToQueue((printer)=>{  //guarda funcion con el diseño del ticket
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
            }, resolve, reject);*/ //pasamos la promesa
        });
    }


    //Funcion para añadir a cola, addToQueue ahora acepta los callbacks de la promesa 3 parametros como funciones
    private addToQueue(builder: (printer: ThermalPrinter)=>void, resolve: (value: PrintResponse)=>void, reject: (reason: any)=>void, nameShare:string):PrintJob{
        const job:PrintJob = { 
            id: Date.now()+'', 
            build: builder,
            resolve,  //se guarda la referencia a la funcion resolve
            reject 
        };
        this.queue.push(job); //en el campo build guarda funcion con el diseño del ticket y los callbacks de las promesas
        this.processQueue(nameShare);
        return job;
    }


    private async processQueue(nameShare:string) {

        if (this.isPrinting || this.queue.length === 0) return;
        this.isPrinting = true;

        const job = this.queue.shift();
        if (!job) {
            this.isPrinting = false;
            return;
        }

        const ticketFile = path.join(this.filePath, `ticket-${job.id}.bin`);
        const printerPath = "\\\\localhost\\"+nameShare;

        try {
            let printer = new ThermalPrinter({
                    type: PrinterTypes.EPSON,  // O PrinterTypes.STAR
                    interface: path.join(this.filePath, `ticket-${job.id}.bin`),   //comentar esta linea si se usa: buffer = printer.getBuffer();
                    characterSet: CharacterSet.PC852_LATIN2, // Configuración de acentos/eñes
                    removeSpecialCharacters: false,
                });

            job.build(printer); //ejecuta la funcion guardada
            /*const buffer = printer.getBuffer();
            // 3. Enviar el Buffer al spooler vía PowerShell mediante STDIN
            // Esto evita crear cualquier archivo en el disco.
            await this.sendBufferToPrinter(buffer, printerPath);*/

            //estas 4 lineas no van, si se activa el buffer anterior
            await fs.mkdir(this.filePath, {recursive:true}); // Si ya existe la carpeta, no pasa nada (gracias a recursive: true)
            await printer.execute();
            await this.execPromise(`cmd /c copy /b "${ticketFile}" "${printerPath}"`);

            const res = {
                ok: true,
                jobId: job.id,
                message: 'Impresión física completada',
                timestamp: new Date()
            }

            // --- ÉXITO ---
            job.resolve(res);  //Llamamos a la función resolve que guardamos antes y le pasamos PrintResponse
            this.bufferLog[0] = res;

        } catch (er) {
            console.log('Error crítico en el proceso de impresión>>', er);
            const res = {
                ok: false,
                jobId: job.id,
                message: `Error: ${er}`,
                timestamp: new Date()
            }
                job.reject(res); // Resolvemos con ok: false para indicar fallo controlado
                this.bufferLog[0] = res;
        }finally{
            try {
                await fs.unlink(ticketFile);
            } catch (er) { 
            }
            this.isPrinting = false;
        // 🔥 procesa siguiente automáticamente
        this.processQueue(nameShare);
        }

    }


    async openCashDrawer(nameShare:string):Promise<boolean>{
        let printer = new ThermalPrinter({
            type: PrinterTypes.EPSON,  // O PrinterTypes.STAR
            interface: path.join(this.filePath, 'openCashDrawer.bin'), // El nombre en el Panel de Control
            characterSet: CharacterSet.PC852_LATIN2, // Configuración de acentos/eñes
            removeSpecialCharacters: false,
        });

        // Abrir el cajón monedero
        printer.openCashDrawer();
        try {
            await fs.mkdir(this.filePath, {recursive:true}); // Si ya existe la carpeta, no pasa nada (gracias a recursive: true)
            await printer.execute();
            const ticketFile = path.join(this.filePath, 'openCashDrawer.bin');
            const printerPath = "\\\\localhost\\"+nameShare;
            await this.execPromise(`cmd /c copy /b "${ticketFile}" "${printerPath}"`);
            await fs.unlink(ticketFile);
            return true;
        } catch (er) {
            console.log('Error crítico en el proceso de apertura del cajon monedero>>', er);
            return false;
        }
    }


    protected async statushardware(nameShare:string):Promise<boolean>{
        try {
            const { stdout } = await this.execPromise(`powershell -Command "Get-Printer -Name '${nameShare}' | Select-Object -ExpandProperty PrinterStatus"`);
            const status = stdout.trim();
            if (status === 'Normal' || status === '3') { //lista para imprimir
                return true;
            }
            return false;  //Offline/Desconocido
        } catch (error) {
            // Si el comando falla, usualmente es porque el nombre de la impresora no existe
            return false; // La impresora ni siquiera existe o está offline
        }
    }

    /*private sendBufferToPrinter(buffer: Buffer, printerName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            // Comando para que PowerShell reciba bytes de la entrada estándar y los mande a la impresora
            const child = spawn('powershell', [
                '-Command',
                `$input | Out-Printer -Name "${printerName}"`
            ]);

            child.stdin.write(buffer);
            child.stdin.end();

            child.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`PowerShell salió con código ${code}`));
            });

            child.on('error', (err) => reject(err));
        });
    }*/

    async printPOS(print: Print): Promise<any> {

        
       
    }
}