import { Repository } from "./RepositoryTypes"


//------------------------------------------------------------------------------

//interfaz del repositorio
/*interface IPrintRepository extends Repository<Print>{
    findPending(): Promise<Print[]>;
}*/

//interfaz del servicio
interface IFileService {
    downloadFileLogo(nombre: string):Promise<boolean>,
}


export{
    IFileService
}
