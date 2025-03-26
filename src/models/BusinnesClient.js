import mongoose from "mongoose";

const businnesClientSchema = new mongoose.Schema({
    name: String,
    ruc: String,
    address: String,
    mine : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mine'
    },
    businnesContract : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'BusinnesContract'
    }
})

const BusinnesClient = mongoose.model('BusinnesClient', businnesClientSchema);

export default BusinnesClient;