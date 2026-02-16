import { User } from "types/UsersTypes";
import mongoose, { Schema } from "mongoose";
import  argon2  from "argon2";

//definir el esquema y el modelo de MongoDB.
const userSchema: Schema = new Schema<User>(
    {
        name: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        }
    },{
        timestamps: true,
        versionKey: false
    }
);


//middleware se ejecuta antes de guardar save(). this es el documento del usuario
userSchema.pre<User>("save", async function () {  //detecta si el password cambió, detecta si es un usuario nuevo
    try {
        if(this.isModified("password") || this.isNew)
            this.password = await argon2.hash(this.password, {type: argon2.argon2id});
        
    } catch (error) {
        throw error;
    }
});

//metodo declarado en UserTypes.ts interfaz User
userSchema.methods.verifyPassword = async function(password: string):Promise<boolean> {
  return await argon2.verify(this.password, password);
};


//se ejecuta automaticamnete cuando se hace res.json(user)
userSchema.methods.toJSON = function(){
    const userObj = this.toObject();
    delete userObj.password;  //Elimina el password antes de enviarlo al cliente
    return userObj;
};


export const UserModel = mongoose.model<User>('User', userSchema);
