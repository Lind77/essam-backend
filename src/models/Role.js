import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: Boolean,
    entityType:{
        type: Number,
        required: true,
    },
    entityId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
})

const Role = mongoose.model('Role', roleSchema);

export default Role;