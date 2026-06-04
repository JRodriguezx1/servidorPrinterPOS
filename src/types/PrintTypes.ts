//import { Repository } from "./RepositoryTypes"


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

interface BrokerMessage {
    type: string;
    payload: {
        jobId: string;
        printerName: string;
        tipoTicket: string;
        content: InvoiceData;
    }
}

//========================================================================================
interface ConsumidorFinal {
    identification_number: string,
    name: string,
    phone: string | null,
    address: string | null,
    email: string | null,
    municipality_id: string | null
}
interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  tipodocumento: string;
  identificacion: string;
  telefono: string;
  email: string;
  fecha_nacimiento: string | null;
  total_compras: number | null;
  ultima_compra: string | null;
  totaldebe: number | null;
  limitecredito: number | null;
  data1: string | null;
  created_at: string;
}
interface ItemFactura {
  id: string;
  idproducto: string;
  tipoproducto: string;
  tipoproduccion: string;
  idcategoria: string;
  nombreproducto: string;
  rendimientoestandar: string;
  foto: string;
  costo: string;
  valorunidad: string;
  stock: number;
  promediostock: number;
  prioridadcomision: string;
  percentcomision: number;
  valorcomision: number;
  subtotal: number;
  base: number;
  impuesto: string;
  valorimp: number;
  descuento: number;
  total: number;
}
interface MedioPago {
  idmediopago: string;
  mediopago: string;
  valor: number;
}
interface Resolution {
    consecutivoremplazo: string | null;
    electronica: string | null;
    estado: string;
    fechafin: string | null;
    fechainicio: string | null;
    id: string;
    id_sucursalid: string;
    idcompania: string;
    idnegocio: string;
    idtipofacturador: string;
    mostrarimpuestodiscriminado: string;
    mostrarresolucion: string;
    nombre: string;
    prefijo: string;
    rangofinal: string;
    rangoinicial: string;
    resolucion: string;
    siguientevalor: number;
    tokenfacturaelectronica: string | null;
}
interface InvoiceData {
  negocio: string;
  sucursal: string;
  nit: string;
  direccion: string;
  telefono: string;
  email: string;
  www: string;
  num_orden: number;
  tipoFactura: string;
  textFactura: string;
  prefijo: string;
  consecutivo: string;
  fechaPago: string;
  caja: string;
  vendedor: string;
  consumidorFinal: ConsumidorFinal;
  cliente: Cliente;
  tipoventa: string;
  subtotal: string;
  base: string;
  valorimpuestototal: string;
  descuento: string;
  total: string;
  observacion: string;
  resolucion: Resolution;
  cufe?: string;
  link?: string;
  items: ItemFactura[];
  mediospago: MedioPago[];
}

//interfaz del repositorio
/*interface IPrintRepository extends Repository<Print>{
    findPending(): Promise<Print[]>;
}*/

//interfaz del servicio
interface IPrintService {
    list():Promise<ListPrintersResponse>,
    listPrinter():Promise<ListPrintersResponse>;
    testPrinter(nameShare:string, callbacks?: { onStarted?: () => void; onFinished?: () => void; onFailed?: (error: any) => void }):Promise<PrintResponse>,
    viewLog():Promise<PrintResponse|null>,
    ticketInvoice(nameShare:string, data:InvoiceData, callbacks?: { onStarted?: () => void; onFinished?: () => void; onFailed?: (error: any) => void }):Promise<PrintResponse>,
    openCashDrawer(nameShare:string):Promise<boolean>,
    statushardware(nameShare:string):Promise<PrintResponse>,
    ticketCredito(nameShare: string, data: InvoiceData):Promise<any>,
}

export{
    PrintResponse,
    DevicePOS,
    ListPrintersResponse,
    BrokerMessage,
    InvoiceData,
    IPrintService
}