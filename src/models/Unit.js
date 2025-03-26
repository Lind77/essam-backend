import mongoose from "mongoose";

const unitSchema = new mongoose.Schema({
    name: String,
    mine : {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Mine'
    },
    cafes: [{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Cafe'
    }]
})

const Unit = mongoose.model('Unit', unitSchema);

export default Unit;