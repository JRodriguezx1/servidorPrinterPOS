import { Router } from "express";
import path from "path";

/*import { IUserRepository, IUserService, User } from "types/UsersTypes";
import { userRepository } from "@repositories/userRepository";
import { userService } from "@services/userService";*/
import { userController } from "@controllers/usersController";
import { rolesController } from "@controllers/rolesController";
import { printController } from "@controllers/printController";
import { fileController } from "@controllers/fileController";

/*const userRepo: IUserRepository = new userRepository(); //IUserRepository extiende de Repository y este tiene las propiedades o metodos create() y find()
                                                        // y userRepository implementa de IUserRepository los metodos create() y find() por lo tanto son compatibles.

const usuarioService: IUserService = new userService(userRepo);*/



export class RouterApp {

    static get routes(): Router{
        const router = Router();
        
        const rolescontroller = new rolesController;

        const publicPath = path.join(__dirname, '../views');
        //definir todas las rutas
        router.get('/', (req, res)=>{
            //res.json('lupe lulu');
            //res.send('lupelulu');
            res.sendFile(publicPath+"/index.html");
        });

        //Rutas Print
        router.get('/api/printPOS/list', printController.list);
        router.get('/api/printPOS/listPrinter', printController.listPrinter);
        router.get('/api/printPOS/testPrinter/:nameShare', printController.testPrinter);  //ruta visitada por el cliente local
        router.get('/api/printPOS/viewLog', printController.viewLog);  //ruta visitada por el cliente local
        router.get('/api/printPOS/ticket1', printController.ticket1);
        router.get('/api/printPOS/openCashDrawer/:nameShare', printController.openCashDrawer);
        router.get('/api/printPOS/statushardware/:nameShare', printController.statushardware);
        router.post('/api/printPOS/printer', printController.printTicket);
        
        //Rutas de archivos
        router.get('/api/file/downloadFileLogo', fileController.downloadFileLogo);

        //Rutas user
        router.post('/api/user/create', userController.createuser);
        router.get('/api/allusers', userController.allUsers);
        router.get('/api/user/:id', userController.unUsuario);
        router.put('/api/user/update/:id', userController.updateUser);
        router.delete('/api/user/delete/:id', userController.eliminarUser);
        router.post('/api/auth/register', userController.registerUser);
        router.post('/api/auth/login', userController.loginuser);

        
        ////Rutas role
        router.post('/api/role/create', rolescontroller.createRole);
        router.get('/api/allroles', rolescontroller.allRoles);
        router.get('/api/role/:id', rolescontroller.unRole);
        router.put('/api/role/update:id', rolescontroller.updateRole);
        router.delete('/api/role/delete:id', rolescontroller.eliminarRole);
        
        return router;
    }
}


//user:  julianithox1_db_user
//pass:  p6YgOcwRDJZrmgMA
//mongodb+srv://julianithox1_db_user:<p6YgOcwRDJZrmgMA>@apiusers.kx0cvp8.mongodb.net/apiUsers?appName=apiUsers