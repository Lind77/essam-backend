import Area from "../models/Area.js";

export const createArea = async(req, res) =>{
    const { name, description, headquarter } = req.body; // Obtener los datos del usuario desde el cuerpo de la petición

    const newArea = new Area({ name, description, status:true, headquarter }); // Crear un nuevo usuario con los datos recibidos
    try {
        await newArea.save(); // Guardar el nuevo area en la base de datos
        res.status(201).json(newArea); // Enviar el area creado como respuesta
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating area' }); // Manejar errores
    }
}

export const getAreas = async(req, res) =>{
    try {
        const areas = await Area.find().populate(
            {
                path: 'headquarter',
                populate:{
                    path: 'businnes'
                }
            }
        ).populate('roles'); // Obtener todos los usuarios de la colección
        res.json(areas); // Enviar la lista de usuarios como respuesta JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving areas' }); // Manejar errores
    }
}

export const deleteAreas = async(req, res) =>{
    try {
        const task = await Area.findByIdAndDelete(req.params.id)
        if(!task) return res.status(404).json({msg: 'Area not found'})
        res.sendStatus(204)
    } catch (error) {
        return res.status(404).json({msg:"Area not found"})
    }
}