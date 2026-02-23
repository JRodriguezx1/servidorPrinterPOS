import path, { join } from 'path';
import  fs from 'fs/promises';  //modulo de archivos con mejora asincrona
import { IFileService } from "types/filesTypes";

export class fileService implements IFileService {

    public async downloadFileLogo(nombre: string): Promise<boolean> {
        
        const url:string = `https://${nombre}.j2softwarepos.com/admin/descarga/logo`;
        const response = await fetch(url);
        if (!response.ok)
            throw new Error(`Error al descargar imagen: ${response.statusText}`); //.ok es una propiedad de la respuesta que indica si la respuesta fue exitosa (status 200-299)
        if (!response.headers.get("content-type")?.includes("image/png"))
            throw new Error("El archivo descargado no es una imagen");
        // Convertimos la respuesta a un buffer de Node.js
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // Guardamos el archivo en la carpeta temporal
        await fs.mkdir(join(process.cwd(), "downloads"), { recursive: true });
        const destPath = join(process.cwd(), "downloads", "logo.png");
        await fs.writeFile(destPath, buffer);
        return true;
    }
    
}