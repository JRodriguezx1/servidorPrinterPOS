import  argon2  from "argon2";
import { randomUUID } from "crypto";
import { Cuenta, ICuentaRepository, ICuentaService } from "types/CuentasTypes";


export class cuentaService implements ICuentaService{  //aqui me implelemta esta interfaz: "interface ICuentaService" el cual tiene estas propiedades que son metodos: createuser(),findUsers()

    private cuentaRepository: ICuentaRepository;

    constructor(cuentaRepository: ICuentaRepository){
        this.cuentaRepository = cuentaRepository;
    }

    async createCuenta(cuenta: Cuenta): Promise<Cuenta> {
        
        this.validar(cuenta);
        // validar password maestro
        await this.validarPasswordMaestro(cuenta.password);
        const existe = await this.cuentaRepository.findOne({nombreCuenta: cuenta.nombreCuenta});  //si es null, entonces no eixte cuenta con ese nombre.
        if (existe) throw new Error("Nombre de cuenta ya existe");

        const cuentaHash:Cuenta = {
            ...cuenta,
            id: randomUUID(),
            password: await argon2.hash(cuenta.password, {type: argon2.argon2id}),
            createdAt: new Date()
        }
        const result:Cuenta = await this.cuentaRepository.create(cuentaHash);
        return result;  //si el hash falla igual se devuelve un rechazo
    }

    async findAll(): Promise<Cuenta[]> {
        return [];
    }
    async find(id:string): Promise<Cuenta | null> {
        return null;
    }
    async update(id:string, data:Partial<Cuenta>): Promise<Cuenta | null> {
        return null;
    }
    async delete(id:string): Promise<boolean> {
        return false;
    }


    private validar(data: Cuenta): void {
        if (!data.nombreCuenta?.trim())throw new Error("Nombre requerido");
        if (!data.password)throw new Error("Password requerido");
    }

    
    public async getCuenta(): Promise<Cuenta | null> {
        const existe:Cuenta | null = await this.cuentaRepository.leerJSON_DB();
        return existe;
    }

    async validarPasswordMaestro(passwordIngresado: string) {
        const hash = process.env.passwordAccess;
        if (!hash)throw new Error("Password no configurado");
        const autorizado = await argon2.verify(hash, passwordIngresado);
        if (!autorizado)throw new Error("Password incorrecto");
    }
}
    