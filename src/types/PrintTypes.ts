import { Repository } from "./RepositoryTypes"

//interfaz para imprimir la data
interface Print {
    titulo:string,
    lineas: string[],
    qr:string,
    fecha:string,
    subtotal:string,
    total:string
}

//interfaz para obtener las impresoras "dispositivos"
interface DevicePOS {
    id: number;
    vendorId: number;
    productId: number;
    nombre: string;
    conectada: boolean;
}
interface ListPrintersResponse {
    ok: boolean;
    data: DevicePOS[];
    message?: string;
}
interface PrintResponse {
    ok: boolean;
    jobId: string;
    message: string;
    timestamp: Date;
}

//========================================================================================

interface InvoiceData {
    company: {
        name: string;
        nit: string;
        address: string;
        phone: string;
    };
    invoice: {
        number: string;
        date: string;
        seller: string;
    };
    customer: {
        name: string;
        document: string;
    };
    items: {
        name: string;
        quantity: number;
        price: number;
        total: number;
    }[];
    totals: {
        subtotal: number;
        tax: number;
        total: number;
    };
    payment: {
        method: string;
        received: number;
        change: number;
    };
}

//interfaz del repositorio
interface IPrintRepository extends Repository<Print>{
    findPending(): Promise<Print[]>;
}

//interfaz del servicio
interface IPrintService {
    list():Promise<ListPrintersResponse>,
    listPrinter():Promise<ListPrintersResponse>;
    testPrinter(nameShare:string):Promise<PrintResponse>,
    viewLog():Promise<PrintResponse|null>,
    ticket1(nameShare:string, data:InvoiceData):Promise<PrintResponse>,
    openCashDrawer(nameShare:string):Promise<boolean>,
    statushardware(nameShare:string):Promise<PrintResponse>,
    printPOS(print: Print):Promise<any>,
}

export{
    Print,
    PrintResponse,
    DevicePOS,
    ListPrintersResponse,
    InvoiceData,
    IPrintService
}