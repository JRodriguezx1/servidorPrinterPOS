import fs from 'fs/promises';
import path from 'path';
import { Cuenta, data, ICuentaRepository } from "types/CuentasTypes";

export class cuentaRepository implements ICuentaRepository{

    protected dbFolder :string = path.join(process.cwd(), 'DB');
    protected filePath :string = path.join(this.dbFolder, 'cuentas.json');
    
    async create(data: Cuenta): Promise<Cuenta> {
        try {
            await fs.mkdir(this.dbFolder , {recursive:true});
            await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
            return data;
        } catch (error) {
            console.error("Error al crear cuenta:", error);
            throw error;   
        }
    }


    async findAll(): Promise<Cuenta[]> {
        return [];
    }


    async find(id:string): Promise<Cuenta | null> {
        return null;
    }

    async leerJSON_DB():Promise<Cuenta | null>{
        try {
            await fs.access(this.filePath);
            const fileData = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(fileData);
        } catch (error) {
            console.error("Error al leer JSON DB:", error);
            return null;
        }   
    }


    async findOne(query: data):Promise<Cuenta | null>{
        try {
            const fileExists = await fs.access(this.filePath).then(() => true).catch(() => false);
            if (!fileExists) return null; //si no existe es porque no hay cuentas creadas, entonces se devuelve null

            const fileData = await fs.readFile(this.filePath, 'utf-8');
            const cuenta:Cuenta = JSON.parse(fileData);
            const arraycuenta:[string, string][] = Object.entries(query); // = [["nombreCuenta", "valor"], ["password", "valor"]]

            const isMatch = arraycuenta.every( ([key, value]) => cuenta[key as keyof Cuenta] === value);
            return isMatch ? cuenta : null;
        } catch (error) {
            console.error("Error al buscar cuenta:", error);
            return null;
        }
    }


    async update(id: string, data: Partial<Cuenta>): Promise<Cuenta | null> {
        return null;
    }


    async delete(id: string): Promise<boolean> {
        return false;
    }

}