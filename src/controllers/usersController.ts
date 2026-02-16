import { Request, Response } from "express";
import { IUserRepository, IUserService, User } from "types/UsersTypes";
import { userRepository } from "@repositories/userRepository";
import { userService } from "@services/userService"
import jwt from "jsonwebtoken"

const userRepo:IUserRepository = new userRepository(); //IUserRepository extiende de Repository y este tiene las propiedades o metodos create() y find()
                                                        // y userRepository implementa de IUserRepository los metodos create() y find() por lo tanto son compatibles.
const usuarioService:IUserService = new userService(userRepo);


export class userController {

    static createuser = async(req:Request, res:Response)=>{
        const newuser:User = req.body;
        const result = await  usuarioService.createuser(newuser);
        res.json(result);
    }

    static async allUsers(req:Request, res:Response){
        res.json(await usuarioService.findAll());
    }

    static async unUsuario(req:Request, res:Response){
        const {id} = req.params;  //id esta tipado como string | string[]
        if(Array.isArray(id))return res.status(400).json({ message: "ID inválido" });
        res.json(await usuarioService.find(id));
    }

    static async updateUser(req:Request<{id:string}>, res:Response){
        res.json(await usuarioService.update(req.params.id, req.body));
    }

    static async eliminarUser(req:Request<{id:string}>, res:Response){
         res.json(await usuarioService.delete(req.params.id));
    }

    static registerUser = async(req:Request, res:Response)=>{
        try {
            const {email}:User = req.body;
            const userExist = await usuarioService.findUserByEmail(email);
            if(userExist) return res.status(400).json({message: 'Email existe actualmente'});
            const newUser = await usuarioService.createuser(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            console.log('error >>', error);
            res.status(500).json(error);
        }
    }


    static loginuser = async(req:Request, res:Response)=>{
        try {
            const {email, password}:User = req.body;
            //buscar al usuario
            const userExist = await usuarioService.findUserByEmail(email);
            if(!userExist) return res.status(400).json({message: 'Usuario no existe actualmente'});
            const verifyPass = await userExist.verifyPassword(password);
            if(!verifyPass) return res.status(400).json({message: 'Usuario o password no existe actualmente'});
            const token = jwt.sign({id: userExist._id, email: userExist.email, username: userExist.username}, 'claveSecreta', {expiresIn: '1h'});

            res.json(token);

        } catch (error) {
            console.log('error >>', error);
            res.status(500).json(error);
        }
    }
}