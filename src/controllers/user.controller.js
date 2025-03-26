import User from "../models/User.js";
import Cafe from "../models/Cafe.js"
import Area from "../models/Area.js"

import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('role'); // Obtener todos los usuarios de la colección
        res.json(users); // Enviar la lista de usuarios como respuesta JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving users' }); // Manejar errores
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate({
            path: 'role',
            populate: 'permissions'
        }).populate('permissions').lean(); // Obtener todos los usuarios de la colección
        
        const rolePermissions = user.role[0]?.permissions || [];
        const userPermissions = user.permissions || [];

        const allPermissions = [...userPermissions, ...rolePermissions];

        if(user.entityType == 1){
            user.entity = await Area.findById(user.entityId).lean()
        }else if(user.entityType == 2){
            user.entity = await Cafe.findById(user.entityId).lean()
        }

        user.permissions = allPermissions

        // Obtener todos los usuarios de la colección
        res.json(user); // Enviar la lista de usuarios como respuesta JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving user' }); // Manejar errores
    }
}

export const createUser = async (req, res) => {
    const { name, dni, payrollAccount, email, password, degree, role, entityType, entityId } = req.body; // Obtener los datos del usuario desde el cuerpo de la petición

    try {

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({ name, dni, payrollAccount, credentials:{email, password:hashPassword}, role, degree, entityType, entityId});

        await newUser.save();
        
        if (entityType == 1){
            const areaSelected = await Area.findById(entityId);
            areaSelected.users.push(newUser._id)
            await areaSelected.save()
        }else{
            const cafeSelected = await Cafe.findById(entityId);
            cafeSelected.users.push(newUser._id)
            await cafeSelected.save()
        }
        
        // Guardar el nuevo usuario en la base de datos
        res.status(201).json(newUser); // Enviar el usuario creado como respuesta
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' }); // Manejar errores
    }
}

export const deleteUser = async(req, res) =>{
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user) return res.status(404).json({msg: 'User not found'})
        res.sendStatus(204)
    } catch (error) {
        return res.status(404).json({msg:"User not found"})
    }
}