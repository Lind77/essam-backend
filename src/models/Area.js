import mongoose from "mongoose";

const areaSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: Boolean,
    headquarter : {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Headquarter'
        },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
})

const Area = mongoose.model('Area', areaSchema);

export default Area;