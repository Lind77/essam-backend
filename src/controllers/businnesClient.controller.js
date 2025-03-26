import BusinnessClient from "../models/BusinnesClient.js";

export const createBusinnesClients = async (req, res) => {
    const { name, ruc, address, mine, businnesContract } = req.body; // Obtener los datos del usuario desde el cuerpo de la petición

    const newBussinnesClient = new BusinnessClient({ name, ruc, address, mine, businnesContract }); // Crear un nuevo usuario con los datos recibidos
    try {
        await newBussinnesClient.save(); // Guardar el nuevo usuario en la base de datos
        res.status(201).json(newBussinnesClient); // Enviar el usuario creado como respuesta
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating Businnes Client' }); // Manejar errores
    }
}

export const getBusinnesClients = async (req, res) => {
    try {
        const businnesClients = await BusinnessClient.find().populate('mine').populate('businnesContract'); // Obtener todos los usuarios de la colección
        res.json(businnesClients); // Enviar la lista de usuarios como respuesta JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving Businnes Clients' }); // Manejar errores
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