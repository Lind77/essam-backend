import mongoose from "mongoose";

const cafeSchema = new mongoose.Schema({
    name: String,
    unit : {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Unit'
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
    services: [mongoose.Schema.Types.Mixed],
    sales: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sale' }]
})

const Cafe = mongoose.model('Cafe', cafeSchema);

export default Cafe;