import mongoose from "mongoose";

const dinerSchema = new mongoose.Schema({
    name: String,
    dni: {
        type: String,
        required: true,
        unique: true
    },
    registerCode: String,
    unit : {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Unit'
    },
    businnesClient : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusinnesClient'
    }
})

const Diner = mongoose.model('Diner', dinerSchema);

export default Diner;

