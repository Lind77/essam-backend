import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
    name: String,
    ruc: String,
    fiscalAddress: String,
    legalName: String
})

const Business = mongoose.model('Businnes', businessSchema);

export default Business;