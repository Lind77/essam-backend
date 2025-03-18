import mongoose from "mongoose";

const headquarterSchema = new mongoose.Schema({
    name: String,
    address: String,
    businnes : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Businnes'
    }, 
})

const Headquarter = mongoose.model('Headquarter', headquarterSchema);

export default Headquarter;