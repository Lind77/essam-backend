import mongoose from "mongoose";

const mineSchema = new mongoose.Schema({
    name: String
})

const Mine = mongoose.model('Mine', mineSchema);

export default Mine;