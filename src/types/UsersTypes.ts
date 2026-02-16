import { Document } from 'mongoose';
import { Repository } from './RepositoryTypes';


interface User extends Document{
    id:string,
    name:string,
    username:string,
    email: string,
    password: string,
    verifyPassword(password:string):Promise<boolean>,  //metodo construido en el modelo esquema user de mongoo
}
//type data<k extends string> = Record<k, string>;
/*type data = {
    [key:string]: string;
}*/

type data = Record<string, string> //es igual que la anterior forma

interface IUserRepository extends Repository<User>{
    findOne(query: data):Promise<User | null>  //se define, construye o implementa en userRepository.ts
}

interface IUserService {
    createuser(user: User):Promise<User>,
    findAll(): Promise<User[]>,
    find(id:string):Promise<User | null>,
    findUserByEmail(email:string):Promise<User | null>,
    update(id:string, data:Partial<User>):Promise<User | null>,
    delete(id:string):Promise<boolean>
}

export {
    User,
    data,
    IUserRepository,
    IUserService
}