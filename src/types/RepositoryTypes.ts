//tipos globales del repositorio



export interface Repository<T = unknown>{

    create(data: T): Promise<T>,   //propiedades de la interfaz que son funciones 
    findAll(): Promise<T[]>,
    find(id: string):Promise<T | null>,
    update(id: string, data: Partial<T>):Promise<T | null>
    delete(id:string):Promise<boolean>
}

