import { BrokerMessage, IPrintService } from 'types/PrintTypes';
import { printService } from "@services/printService";
import { ICuentaService } from 'types/CuentasTypes';
 

export class BrokerClient {

    private cuentaService: ICuentaService;
    private readonly printerService:IPrintService = new printService();
    private socket?: WebSocket;
    private reconnecting = false;
    private status: "online" | "offline" | "reconnecting" = "offline";
    private clientRegistered = false;
    private manualRestart = false;

    constructor(cuentaService: ICuentaService){
        this.cuentaService = cuentaService;
    }

    public connect() {
        this.socket = new WebSocket(process.env.BROKER_URL!); //conexion con el servidor websocket
        console.log(this.socket);

        this.socket.onopen = async () => {
            console.log("Conectado al broker");
            this.reconnecting = false;
            this.status = "online";
            await this.register();
        };

        this.socket.onmessage = (event) => {
            //console.log("Mensaje del broker:", event.data);
            this.handleMessage(event.data);
        };

        this.socket.onclose = () => {
            console.log("Reconectando...");
            this.status = "reconnecting";
            if(this.manualRestart){
                this.manualRestart = false;
                this.connect();
                return;
            }
            this.reconnect();
        };

        this.socket.onerror = (error) => {  //si ocurre un error en la conexion, intentar reconectar
            console.log("Error websocket", error);
            //reconexion
            this.status = "reconnecting";
            console.log('reconectando desde onerror');
            //this.reconnect(); //despues de un error, el evento onclose también se dispara, por lo que la reconexión se manejará allí. No es necesario llamar a reconnect() aquí para evitar múltiples intentos de reconexión simultáneos.
        };
    }


    private reconnect() {
        if(this.reconnecting)return;
        this.reconnecting = true;
        console.log("Reconectando...");
        setTimeout(() => {
            this.reconnecting = false;
            this.connect();
        }, 5000);
    }


    private async register() {
        this.clientRegistered = false;
        const cuenta = await this.cuentaService.getCuenta();
        if (!cuenta) {
            this.clientRegistered = false;
            console.log("No se encontró una cuenta en la base de datos. No es posible registrarse al broker.");
            return ;
        }
        this.socket?.send(JSON.stringify({
            type: "register_printer",
            payload: {
                businessId: cuenta.nombreCuenta,
                sucursal: cuenta.sucursal,
                printerName: "CAJA"
            }
        }));
    }


    //esta función puede ser llamada desde el controlador de cuenta para refrescar el registro, útil para cuando se crea una cuenta nueva o se actualiza la cuenta existente.
    public async refreshRegistration(): Promise<boolean> {
        if(this.socket?.readyState !== WebSocket.OPEN)return false;
        await this.register();
        return true;
    }


    public restartConnection() {
        this.clientRegistered = false;
        this.manualRestart = true;
        this.socket?.close();
    }
    

    private async handleMessage(message:string) {
        /*  message ejemplo:
        {
            type: "print",
            payload: {
                jobId: data.jobId,  //identificador unico para el ACK
                printerName: data.printerName, //nombre de la impresora
                tipoTicket: data.tipoTicket, //tipo de ticket
                content: data.content
            }
        }*/
        const mensaje: BrokerMessage = JSON.parse(message);
        switch(mensaje.type){
            case "registered":
                this.clientRegistered = true;
            break;
            case "print":// llamar servicio impresión
                //await this.printerService.ticket1("CAJA", mensaje.payload.content);
                await this.handlePrint(mensaje);
            break;
            case "openDrawer":
                await this.printerService.openCashDrawer(mensaje.payload.printerName);
            break;
            case "cancelJob":
                // cancelJob
            break;
            case "restartPrinter":
                // restartPrinter
            break;
            case "updatePrinters":
                // updatePrinters
            break;
        }
    }


    private async handlePrint(message:BrokerMessage) {
        const { jobId, printerName, tipoTicket, content } = message.payload;  //el jobid es el identificador unico, el cual viene en el mensaje del broker, y se usará para enviar los ACK correspondientes a ese trabajo de impresión específico.
        try {
            this.sendAck(jobId, "received");
             switch (tipoTicket) {
                case "testPrinter":
                    const response =await this.printerService.testPrinter(printerName, { onStarted: () => this.sendAck(jobId, "printing"), onFinished: () => this.sendAck(jobId, "printed"), onFailed: (error) => this.sendAck(jobId, "failed", error.message) });
                    console.log("Respuesta testPrinter:", response);
                break;
                case "ticket":
                    await this.printerService.ticketInvoice(printerName, content, { onStarted: () => this.sendAck(jobId, "printing"), onFinished: () => this.sendAck(jobId, "printed"), onFailed: (error) => this.sendAck(jobId, "failed", error.message) });
                break;
                case "comanda":
                    //await this.printerService.comanda(printerName, content);
                break;
                case "credito":
                    //await this.printerService.comanda(printerName, content);
                break;
                case "abono":
                    //await this.printerService.comanda(printerName, content);
                break;
             }
        } catch(error:any){
            this.sendAck( jobId, "failed", error.message );
        }
    }


    private sendAck(jobId:string, status:string, error?:string){
        if(this.socket?.readyState!==WebSocket.OPEN)return;
        this.socket.send( JSON.stringify({type:"print_ack", payload:{ jobId, status, error}}));
    }

    public get getStatus(){
        return {status: this.status, registered: this.clientRegistered};  //estatus de la conexión con el broker y del registro.
    }


}
