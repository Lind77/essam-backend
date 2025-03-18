import Headquarter from "../models/Headquarters.js";

export const createHeadquarter = async (req, res) => {
    const { name, address, businnes } = req.body; // Obtener los datos del usuario desde el cuerpo de la petición

    const newHeadquarter = new Headquarter({ name, address, businnes }); // Crear un nuevo usuario con los datos recibidos
    try {
        await newHeadquarter.save(); // Guardar el nuevo usuario en la base de datos
        res.status(201).json(newHeadquarter); // Enviar el usuario creado como respuesta
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating headquarter' }); // Manejar errores
    }
}


export const getHeadquarters = async (req, res) => {
    try {
        const headquarters = await Headquarter.find().populate('businnes'); // Obtener todos los usuarios de la colección
        res.json(headquarters); // Enviar la lista de usuarios como respuesta JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving headquarters' }); // Manejar errores
    }
};



export const deleteHeadquarter = async (req, res) => {
        try {
            const headquarter = await Headquarter.findByIdAndDelete(req.params.id)
            if(!headquarter) return res.status(404).json({msg: 'Headquarter not found'})
            res.sendStatus(204)
        } catch (error) {
            return res.status(404).json({msg:"Headquarter not found"})
        }
}