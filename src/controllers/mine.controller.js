import Mine from "../models/Mine.js";

export const createMines = async (req, res) => {
    const { name } = req.body; // Obtener los datos del usuario desde el cuerpo de la petición

    const newMine = new Mine({ name }); // Crear un nuevo usuario con los datos recibidos
    try {
        await newMine.save(); // Guardar el nuevo usuario en la base de datos
        res.status(201).json(newMine); // Enviar el usuario creado como respuesta
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating mine' }); // Manejar errores
    }
}

export const getMines = async (req, res) => {
    try {
        const mines = await Mine.find(); // Obtener todos los usuarios de la colección
        res.json(mines); // Enviar la lista de usuarios como respuesta JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving mines' }); // Manejar errores
    }
};


export const deleteMines = async (req, res) => {
        try {
            const mine = await Mine.findByIdAndDelete(req.params.id)
            if(!mine) return res.status(404).json({msg: 'Mine not found'})
            res.sendStatus(204)
        } catch (error) {
            return res.status(404).json({msg:"Mine not found"})
        }
}