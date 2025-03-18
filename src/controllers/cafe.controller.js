import Cafe from "../models/Cafe.js";

export const createCafes = async (req, res) => {
    const { name, unit } = req.body; // Obtener los datos del usuario desde el cuerpo de la petición

    const newCafe = new Cafe({ name, unit, roles:[] }); // Crear un nuevo usuario con los datos recibidos
    try {
        await newCafe.save(); // Guardar el nuevo usuario en la base de datos
        res.status(201).json(newCafe); // Enviar el usuario creado como respuesta
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating Cafe' }); // Manejar errores
    }
}

export const getCafes = async (req, res) => {
    try {
        const cafes = await Cafe.find().populate('roles'); // Obtener todos los usuarios de la colección
        res.json(cafes); // Enviar la lista de usuarios como respuesta JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving Cafes' }); // Manejar errores
    }
};


export const deleteCafes = async (req, res) => {
        try {
            const cafe = await Cafe.findByIdAndDelete(req.params.id)
            if(!cafe) return res.status(404).json({msg: 'Cafe not found'})
            res.sendStatus(204)
        } catch (error) {
            return res.status(404).json({msg:"Cafe not found"})
        }
}