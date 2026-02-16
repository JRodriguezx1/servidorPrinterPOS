import mongoose, { Schema } from "mongoose";
import { Role } from "types/RolesTypes";

const roleSchema: Schema = new Schema<Role>(
    {
        name: {
            type: String,
            required: true
        },
    },{
        timestamps: true,
        versionKey: false
    }
);

export const RoleModel = mongoose.model<Role>('Role', roleSchema);
//////                             <tipo de role>, 'nombre de la conexion'