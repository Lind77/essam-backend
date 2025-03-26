import BusinnesContract from "../models/BusinnesContract.js";


export const createBusinnesContracts = async (req, res) => {
    const { name, ruc, mine } = req.body; // Obtener los datos del usuario desde el cuerpo de la petición

    const newBusinnesContract = new BusinnesContract({ name, ruc, mine }); // Crear un nuevo usuario con los datos recibidos
    try {
        await newBusinnesContract.save(); // Guardar el nuevo usuario en la base de datos
        res.status(201).json(newBusinnesContract); // Enviar el usuario creado como respuesta
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating Businnes Client' }); // Manejar errores
    }
}

export const getBusinnesContracts = async (req, res) => {
    try {
        const businnesContract = await BusinnesContract.find().populate('mine'); // Obtener todos los usuarios de la colección
        res.json(businnesContract); // Enviar la lista de usuarios como respuesta JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving Businnes Clients' }); // Manejar errores
    }
};


export const deleteContracts = async (req, res) => {
        try {
            const unit = await Unit.findByIdAndDelete(req.params.id)
            if(!unit) return res.status(404).json({msg: 'Unit not found'})
            res.sendStatus(204)
        } catch (error) {
            return res.status(404).json({msg:"Unit not found"})
        }
}