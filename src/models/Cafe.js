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
    services: [{
        service: {type: mongoose.Schema.Types.ObjectId, ref: 'Service'},
        prices: Object
    }],
    sales: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sale' }]
})

const Cafe = mongoose.model('Cafe', cafeSchema);

export default Cafe;