import User from "../models/User.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find(); // Obtener todos los usuarios de la colección
        res.json(users); // Enviar la lista de usuarios como respuesta JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving users' }); // Manejar errores
    }
};

export const createUser = async (req, res) => {
    const { name, lastname, email, password, roles } = req.body; // Obtener los datos del usuario desde el cuerpo de la petición
    const newUser = new User({ name, lastname, email, password, roles }); // Crear un nuevo usuario con los datos recibidos
    try {
        await newUser.save(); // Guardar el nuevo usuario en la base de datos
        res.status(201).json(newUser); // Enviar el usuario creado como respuesta
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' }); // Manejar errores
    }
}