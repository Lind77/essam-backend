import Diner from "../models/Diner.js";

export const createDiners = async (req, res) => {
    const { name, dni, businnesClient, unit } = req.body; // Obtener los datos del usuario desde el cuerpo de la petición

    const newDiner = new Diner({ name, dni, businnesClient ,unit }); // Crear un nuevo usuario con los datos recibidos
    try {
        await newDiner.save();
        
        const populatedDiner = await Diner.findById(newDiner._id).populate('unit');// Guardar el nuevo usuario en la base de datos
        res.status(201).json(populatedDiner); // Enviar el usuario creado como respuesta
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating Diner' }); // Manejar errores
    }
}

export const getDiners = async (req, res) => {
    try {
        const diners = await Diner.find().populate(
            {
                path: 'unit',
                populate:{
                    path: 'mine'
                }
            }
        ); // Obtener todos los usuarios de la colección
        res.json(diners); // Enviar la lista de usuarios como respuesta JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving Diners' }); // Manejar errores
    }
};


export const deleteDiners = async (req, res) => {
        try {
            const diner = await Diner.findByIdAndDelete(req.params.id)
            if(!diner) return res.status(404).json({msg: 'Diner not found'})
            res.sendStatus(204)
        } catch (error) {
            return res.status(404).json({msg:"Diner not found"})
        }
}

export const showDiner = async (req, res) => {
    try {
        const diner = await Diner.find({ dni: req.params.id }).populate({
            path: 'unit',
            populate: 'cafes'
        }).populate('businnesClient')
        console.log(diner)
        if(!diner) return res.status(404).json({msg: 'Diner not found'})
        res.status(201).json(diner[0]);
    } catch (error) {
        console.log(error)
        return res.status(404).json({msg:"Diner not found"})
    }
}

export const createDinersExcel = async (req, res) => {
    const dinersData = req.body; // Obtener el array de diners desde el cuerpo de la petición

    if (!Array.isArray(dinersData)) {
        return res.status(400).json({ message: "Se esperaba un array de diners." });
    }

    try {
        const savedDiners = [];

        // Iterar sobre cada diner en el array
        for (const dinerData of dinersData) {
            
            const { name, dni, unit, businnesClient } = dinerData;


            // Crear un nuevo Diner
            const newDiner = new Diner({ name, dni, unit, businnesClient });

            // Guardar el Diner en la base de datos
            await newDiner.save();

            // Poblar el campo "unit" y agregar el Diner guardado al array
            const populatedDiner = await Diner.findById(newDiner._id).populate('unit');
            savedDiners.push(populatedDiner);
        }

        // Responder con los diners creados
        return savedDiners;
    } catch (error) {
        console.error(error);
        throw new Error('Error creating Diners');
    }
}