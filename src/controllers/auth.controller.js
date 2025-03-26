import User from "../models/User.js";
import Cafe from "../models/Cafe.js";
import Area from "../models/Area.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const logIn = async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ 'credentials.email': email }).populate('permissions').populate(
            {
                path: 'role',
                populate:{
                    path: 'permissions'
                }
            }
        ).lean();

        const rolePermissions = user.role[0]?.permissions || [];
        const userPermissions = user.permissions || [];

        const allPermissions = [...userPermissions, ...rolePermissions];

        user.permissions = allPermissions

        if(user.entityType == 1){
            user.entity = await Area.findById(user.entityId).lean()
        }else if(user.entityType == 2){
            user.entity = await Cafe.findById(user.entityId).lean()
        }

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.credentials.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales invalidas' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '9h' });

        delete user.credentials;

        res.status(200).json({ message: 'Login successful', token, user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error login user', error });
    }
    
}

export const logOut = (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};