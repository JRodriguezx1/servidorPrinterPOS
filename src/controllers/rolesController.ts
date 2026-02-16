import { Request, Response } from "express";
import { roleService } from "@services/roleService";
import { roleRepository } from "@repositories/roleRepository";
import { IRolesRepository, IRolesService, Role } from "types/RolesTypes";

const roleRpe: IRolesRepository = new roleRepository();
const roleServicio: IRolesService = new roleService(roleRpe);

export class rolesController {

    
    constructor(){

    }

    createRole = async(req:Request, res:Response)=>{
        const newrole:Role = req.body;
        const result = await  roleServicio.createRole(newrole);
        res.json(result);
    }

    async allRoles(req:Request, res:Response){
        res.json(await roleServicio.findAll());
    }

    async unRole(req:Request, res:Response){
        const {id} = req.params;
        if(Array.isArray(id))return res.status(400).json({ message: "ID inválido" });
        res.json(await roleServicio.find(id));
    }

    async updateRole(req:Request<{id:string}>, res:Response){
        res.json(await roleServicio.update(req.params.id, req.body));
    }

    async eliminarRole(req:Request<{id:string}>, res:Response){
         res.json(await roleServicio.delete(req.params.id));
    }
}