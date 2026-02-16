import { RoleModel } from "@models/role"; 
import { IRolesRepository, Role } from "types/RolesTypes";

export class roleRepository implements IRolesRepository{  
  
    async create(data: Role): Promise<Role> {
        const newRole = new RoleModel(data);
        return await newRole.save();

    }

    async findAll(): Promise<Role[]> {
        //return this.users;
        return await RoleModel.find().exec();  
    }

    async find(id:string): Promise<Role | null> {
        //return this.users[0];
        return await RoleModel.findById(id).exec();
    }

    async update(id: string, data: Partial<Role>): Promise<Role | null> {
        return await RoleModel.findByIdAndUpdate(id, data, {new: true}).exec();
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await RoleModel.findByIdAndDelete(id).exec();
        return deleted !=null;
    }
}