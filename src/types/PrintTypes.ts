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
  cantidad: number;
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
interface InvoiceData {
  negocio: string;
  nit: string;
  direccion: string;
  telefono: string;
  email: string;
  num_orden: number;
  textFactura: string;
  prefijo: string;
  consecutivo: string;
  fechaPago: string;
  caja: string;
  vendedor: string;
  cliente: Cliente;
  tipoventa: string;
  subtotal: string;
  base: string;
  valorimpuestototal: string;
  descuento: string;
  total: string;
  observacion: string;
  items: ItemFactura[];
  mediospago: MedioPago[];
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