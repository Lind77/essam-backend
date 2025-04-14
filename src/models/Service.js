import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    code: String,
    name: String,
    description: String
})

const Service = mongoose.model('Service', serviceSchema);

export default Service;