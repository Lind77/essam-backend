import Business from "../models/Business.js";

export const createBusiness = async(req, res) =>{
    const {  name, ruc, fiscalAddress, legalName } = req.body; // Obtener los datos del usuario desde el cuerpo de la petición

    const newBusinnes = new Business({ name, ruc, fiscalAddress, legalName  }); // Crear un nuevo usuario con los datos recibidos
    try {
        await newBusinnes.save(); // Guardar el nuevo area en la base de datos
        res.status(201).json(newBusinnes); // Enviar el area creado como respuesta
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating businnes' }); // Manejar errores
    }
}

export const getBusinnes = async(req, res) =>{
    try {
        const businnes = await Business.find(); // Obtener todos los usuarios de la colección
        res.json(businnes); // Enviar la lista de usuarios como respuesta JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving businnes' }); // Manejar errores
    }
}

export const deleteBusinnes = async(req, res) =>{
    try {
        const business = await Business.findByIdAndDelete(req.params.id)
        if(!business) return res.status(404).json({msg: 'Businnes not found'})
        res.sendStatus(204)
    } catch (error) {
        return res.status(404).json({msg:"Businnes not found"})
    }
}