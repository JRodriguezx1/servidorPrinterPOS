import { Repository } from './RepositoryTypes';

interface Cuenta{
    id:string,
    nombreCuenta:string,
    password:string,
    //verifyPassword(password:string):Promise<boolean>,  //metodo construido en el modelo esquema user de mongoo
    createdAt: Date;
}

type data = Record<string, string> //es igual que la anterior forma

interface ICuentaRepository extends Repository<Cuenta>{
    findOne(query: data):Promise<Cuenta | null>,  //se define, construye o implementa en userRepository.ts
    leerJSON_DB():Promise<Cuenta | null>,
}

interface ICuentaService {
    createCuenta(cuenta: Cuenta):Promise<Cuenta>,
    findAll(): Promise<Cuenta[]>,
    find(id:string):Promise<Cuenta | null>,
    getCuenta():Promise<Cuenta | null>,
    update(id:string, data:Partial<Cuenta>):Promise<Cuenta | null>,
    delete(id:string):Promise<boolean>
}

export {
    Cuenta,
    data,
    ICuentaRepository,
    ICuentaService
}