import { Repository } from './RepositoryTypes';


interface Role{
    name:string,
}

interface IRolesRepository extends Repository<Role>{}

interface IRolesService {
    createRole(Role: Role):Promise<Role>,
    findAll(): Promise<Role[]>,
    find(id:string):Promise<Role | null>,
    update(id:string, data:Partial<Role>):Promise<Role | null>,
    delete(id:string):Promise<boolean>
}

export {
    Role,
    IRolesRepository,
    IRolesService
}