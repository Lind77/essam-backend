import mongoose from "mongoose";

const businnesContractSchema = new mongoose.Schema({
    name: String,
    ruc: String,
    mine : {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Mine'
    }
})

const BusinnesContract = mongoose.model('BusinnesContract', businnesContractSchema);

export default BusinnesContract;