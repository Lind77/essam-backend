import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: Boolean,
    url: String,
})

const Permission = mongoose.model('Permission', permissionSchema);

export default Permission;