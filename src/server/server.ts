import express, { Router }  from "express";
import path from "path";

export class Server{

    private readonly app = express();
    private readonly port:number;
    private readonly routes:Router; 
    constructor(port: number, routes:Router){
        this.port = port;
        this.routes = routes;
    }

    start(){
        //middleware serializar la data
        this.app.use(express.json());
        //middleware para tolerar el x-www-form-urlencoded
        this.app.use(express.urlencoded({extended:true}));
        //usar las rutas definidas
        this.app.use(this.routes);  //monta rutas, todas las rutas cuelgan desde / el prefijo se define en AppRouter
        //
        this.app.use(express.static(path.join(__dirname, '../public')));
        //escuchar el puerto
        this.app.listen(3000, ()=>{
            console.log(`Server running on port ${3000}`);
        });
        
        //const publicPath = path.join(__dirname, '../public');

    }

}