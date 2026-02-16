import { UserModel } from "@models/users";  //UserModel = mongoose.model
import { data, IUserRepository, User } from "types/UsersTypes";

export class userRepository implements IUserRepository{  //implementa IUserRepository que a su vez extiende de Repository y este tiene las propiedades o metodos create() y find()
    //private users: User[] = [];

    //se implementa o se construye los metodos de interface IUserRepository extends Repository
    async create(data: User): Promise<User> {
        //this.users.push(data);
        //return data;
        const newUser = new UserModel(data);
        return await newUser.save();

    }

    async findAll(): Promise<User[]> {
        //return this.users;
        return await UserModel.find().exec();  //con find retorna todo el documento con exec la data, retorna un arreglo de objetos segun la condicion 
    }

    async find(id:string): Promise<User | null> {
        //return this.users[0];
        return await UserModel.findById(id).exec();
    }

    async findOne(query: data):Promise<User | null>{
        return await UserModel.findOne(query);  //retonr el primer objeto segun la condicion
    }

    async update(id: string, data: Partial<User>): Promise<User | null> {
        return await UserModel.findByIdAndUpdate(id, data, {new: true}).exec();
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await UserModel.findByIdAndDelete(id).exec();
        return deleted !=null;
    }
}