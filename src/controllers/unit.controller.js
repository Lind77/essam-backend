import Unit from "../models/Unit.js";

export const createUnits = async (req, res) => {
    const { name, mine } = req.body; // Obtener los datos del usuario desde el cuerpo de la petición

    const newUnit = new Unit({ name, mine }); // Crear un nuevo usuario con los datos recibidos
    try {
        await newUnit.save();
        
        // Guardar el nuevo usuario en la base de datos
        res.status(201).json(newUnit); // Enviar el usuario creado como respuesta
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating Unit' }); // Manejar errores
    }
}

export const getUnits = async (req, res) => {
    try {
        const units = await Unit.find().populate('mine'); // Obtener todos los usuarios de la colección
        res.json(units); // Enviar la lista de usuarios como respuesta JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving Units' }); // Manejar errores
    }
};


export const deleteUnits = async (req, res) => {
        try {
            const unit = await Unit.findByIdAndDelete(req.params.id)
            if(!unit) return res.status(404).json({msg: 'Unit not found'})
            res.sendStatus(204)
        } catch (error) {
            return res.status(404).json({msg:"Unit not found"})
        }
}