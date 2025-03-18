import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const logIn = async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ 'credentials.email': email }).populate('permissions');
        console.log(user)
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.credentials.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales invalidas' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '9h' });

        res.status(200).json({ message: 'Login successful', token, user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error login user' });
    }
    
}

export const logOut = (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};