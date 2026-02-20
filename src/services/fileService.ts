import path, { join } from 'path';
import  fs from 'fs/promises';  //modulo de archivos con mejora asincrona
import { IFileService } from "types/filesTypes";

export class fileService implements IFileService {

    public async downloadFileLogo(): Promise<boolean> {
        const url:string = "https://demo.j2softwarepos.com/admin/descarga/logo";
         try {
            const response = await fetch(url);
            /*if (!response.ok) {
                //throw new Error(`Error al descargar imagen: ${response.statusText}`);
            }*/
            // Convertimos la respuesta a un buffer de Node.js
            const arrayBuffer = await response.arrayBuffer();
            console.log(arrayBuffer);
            const buffer = Buffer.from(arrayBuffer);
            // Guardamos el archivo en la carpeta temporal
            await fs.mkdir(join(process.cwd(), "downloads"), { recursive: true });
            const destPath = join(process.cwd(), "downloads", "logo.png");
            await fs.writeFile(destPath, buffer);
            return true;
        } catch (error) {
            console.error("Error en downloadLogo con fetch:", error);
            return false;
        }
    }
}