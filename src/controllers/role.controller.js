import Role from "../models/Role.js"
import Cafe from "../models/Cafe.js"
import Area from "../models/Area.js"

export const getRoles = async (req, res) => {
    try {
        const roles = await Role.find(); // Obtener todos los usuarios de la colección
        res.json(roles); // Enviar la lista de usuarios como respuesta JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving roles' }); // Manejar errores
    }
};

export const createRole = async (req, res) => {
    const { name, description, entityType, entityId } = req.body; // Obtener los datos del usuario desde el cuerpo de la petición
    const newRole = new Role({ name, description, status: true, entityType, entityId }); // Crear un nuevo usuario con los datos recibidos
    try {
        await newRole.save();
        
        if (entityType === 1){
            const areaSelected = await Area.findById(entityId);
            areaSelected.roles.push(newRole._id)
            await areaSelected.save()
        }else{
            const cafeSelected = await Cafe.findById(entityId);
            cafeSelected.roles.push(newRole._id)
            await cafeSelected.save()
        }
        
        // Guardar el nuevo usuario en la base de datos
        res.status(201).json(newRole); // Enviar el usuario creado como respuesta
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating role' }); // Manejar errores
    }
}

export const deleteRole = async (req, res) => {
        try {
            const role = await Role.findByIdAndDelete(req.params.id)
            if(!role) return res.status(404).json({msg: 'Role not found'})
            res.sendStatus(204)
        } catch (error) {
            return res.status(404).json({msg:"Role not found"})
        }
}