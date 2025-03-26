import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    dateTime: {
        type: Date,
        default: Date.now
    },
    diner:{
        dinerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Diner'},
        dinerName: String,
        dinerDni: String,
    },
    bussinesClientName: String,
    service:{
        serviceId: {type: mongoose.Schema.Types.ObjectId, ref: 'Service'},
        serviceName: String
    },
    cafe:{
        cafeId: {type: mongoose.Schema.Types.ObjectId, ref: 'Cafe'},
        cafeName: String
    },
    price: Number,
    paymentType: Number
})

const Sale = mongoose.model('Sale', saleSchema);

export default Sale;