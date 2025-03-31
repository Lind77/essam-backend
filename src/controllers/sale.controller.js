import Sale from "../models/Sale.js";

export const createSale = async (req, res) => {

    const {diner, businnesClient, service, cafe, price, paymentType} = req.body

    const now = new Date();

    if(paymentType == 1){
        const existingSale = await Sale.findOne({
            "diner.dinerId": diner._id,
            "service.serviceId": service._id,
            dateTime: {
              $gte: new Date(new Date().setHours(0, 0, 0, 0)), // Hoy a las 00:00:00
              $lt: new Date(new Date().setHours(23, 59, 59, 999)) // Hoy a las 23:59:59
            }
          }).exec();
    
        if(existingSale){
            return res.status(400).json({ message: 'Venta ya registrada'})
        }
    }

    

    const newSale = new Sale({
        diner:{
            dinerId: diner._id,
            dinerName: diner.name,
            dinerDni: diner.dni
        },
        bussinesClientName: diner.businnesClient.name,
        service:{
            serviceId: service._id,
            serviceName: service.name
        },
        cafe:{
            cafeId: cafe._id,
            cafeName: cafe.name
        },
        price,
        paymentType
    })

    try {
        await newSale.save(); // Guardar el nuevo area en la base de datos
        res.status(201).json(newSale); // Enviar el area creado como respuesta
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating sale' }); // Manejar errores
    }

}

export const getSales = async (req, res) => {
    try {
        const sales = await Sale.find()
        res.json(sales);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving sale' });
    }
}