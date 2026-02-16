import { IRolesService, IRolesRepository, Role } from "types/RolesTypes";



export class roleService implements IRolesService{  

    private roleRepository: IRolesRepository; 

    constructor(roleRepository: IRolesRepository){
        this.roleRepository = roleRepository;
    }

    async createRole(role: Role): Promise<Role> { 
        return this.roleRepository.create(role);  
    }
    async findAll(): Promise<Role[]> {
        return this.roleRepository.findAll();
    }
    async find(id:string): Promise<Role | null> {
        return this.roleRepository.find(id);
    }
    async update(id:string, data:Partial<Role>): Promise<Role | null> {
        return this.roleRepository.update(id, data);
    }
    async delete(id:string): Promise<boolean> {
        return this.roleRepository.delete(id);
    }

}