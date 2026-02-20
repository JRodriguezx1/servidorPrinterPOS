import { fileService } from "@services/fileService";
import { IFileService } from "types/filesTypes";

const fileServiceInstance:IFileService = new fileService();

export class fileController {


    static downloadFileLogo = async(req:any, res:any)=>{
        const result = await fileServiceInstance.downloadFileLogo();
        if(result){
            res.json({message:"Archivo descargado correctamente"});
        }else{
            res.status(500).json({message:"Error al descargar el archivo"});
        }
    }
}