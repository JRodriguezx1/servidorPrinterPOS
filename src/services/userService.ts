import { IUserRepository, IUserService, User } from "types/UsersTypes";



export class userService implements IUserService{  //aqui me implelemta esta interfaz: "interface IUserService" el cual tiene estas propiedades que son metodos: createuser(),findUsers()

    private userRepository: IUserRepository; //aqui esta propiedad es de tipo IUserRepository que a su vez implementa de Repository, el cual tiene estas propiedades que son funciones create(), find()

    constructor(userRepository: IUserRepository){
        this.userRepository = userRepository;
    }

    async createuser(user: User): Promise<User> { //este metodo createuser() viene de la interfaz IUserService
        return this.userRepository.create(user);  //este metodo create() viene de IUserRepository que a su vez extiende de Repository
    }
    async findAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }
    async find(id:string): Promise<User | null> {
        return this.userRepository.find(id);
    }
    async findUserByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({email: email});
    }
    async update(id:string, data:Partial<User>): Promise<User | null> {
        return this.userRepository.update(id, data);
    }
    async delete(id:string): Promise<boolean> {
        return this.userRepository.delete(id);
    }

}