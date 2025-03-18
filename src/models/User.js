import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    dni: { 
        type: String, 
        required: [true, "El DNI es obligatorio"], 
        unique: true 
    },
    payrollAccount: String,
    status: { 
        type: Boolean, 
        default: true 
    },
    degree: { 
        type: Number, 
        min: 0, 
        max: 5 
    },
    credentials: {
        email: { 
            type: String, 
            required: [true, "El email es obligatorio"], 
            unique: true,
            password: String,
        },
        password: { 
            type: String, 
            required: [true, "La contraseña es obligatoria"] 
        }
    },
    role: Array,
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
    entityType:{
        type: Number,
        required: true,
    },
    entityId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
})

const User = mongoose.model('User', userSchema);

export default User;