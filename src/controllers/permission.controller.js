import Permission from "../models/Permission.js";
import Role from "../models/Role.js";
import User from "../models/User.js";

export const createPermission = async(req, res) =>{
    const { name, description, url } = req.body; // Obtener los datos del usuario desde el cuerpo de la petición

    const newPermission = new Permission({ name, description, status:true, url }); // Crear un nuevo usuario con los datos recibidos
    try {
        await newPermission.save(); // Guardar el nuevo area en la base de datos
        res.status(201).json(newPermission); // Enviar el area creado como respuesta
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating permission' }); // Manejar errores
    }
}

export const getPermissions = async(req, res) =>{
    try {
        const permissions = await Permission.find(); // Obtener todos los usuarios de la colección
        res.json(permissions); // Enviar la lista de usuarios como respuesta JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving permissions' }); // Manejar errores
    }
}

export const deletePermissions = async(req, res) =>{
    try {
        const permission = await Permission.findByIdAndDelete(req.params.id)
        if(!permission) return res.status(404).json({msg: 'Permission not found'})
        res.sendStatus(204)
    } catch (error) {
        return res.status(404).json({msg:"Permission not found"})
    }
}

export const syncUserPermissions = async(req, res) =>{
    try {

        const { userId, selectedPermissions } = req.body

        const updatedUser = await User.findByIdAndUpdate(userId, 
            {permissions: selectedPermissions},
            {new: true}
        )

        return res.status(200).json(updatedUser)
    } catch (error) {
        return res.status(404).json({msg:"Error syncing permissions"})
    }
}

export const syncRolePermissions = async(req, res) =>{
    try {

        const { roleId, selectedPermissions } = req.body

        const updateRole = await Role.findByIdAndUpdate(roleId, 
            {permissions: selectedPermissions},
            {new: true}
        )

        return res.status(200).json(updateRole)
    } catch (error) {
        return res.status(404).json({msg:"Error syncing permissions"})
    }
}