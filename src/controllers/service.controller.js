import Service from "../models/Service.js";
import Cafe from "../models/Cafe.js";

export const createService = async(req, res) =>{
    const {  name, description } = req.body; // Obtener los datos del usuario desde el cuerpo de la petición

    const newService = new Service({ name, description  }); // Crear un nuevo usuario con los datos recibidos
    try {
        await newService.save(); // Guardar el nuevo area en la base de datos
        res.status(201).json(newService); // Enviar el area creado como respuesta
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating services' }); // Manejar errores
    }
}

export const getServices = async(req, res) =>{
    try {
        const services = await Service.find(); // Obtener todos los usuarios de la colección
        res.json(services); // Enviar la lista de usuarios como respuesta JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving services' }); // Manejar errores
    }
}

export const deleteServices = async(req, res) =>{
    try {
        const service = await Service.findByIdAndDelete(req.params.id)
        if(!service) return res.status(404).json({msg: 'Service not found'})
        res.sendStatus(204)
    } catch (error) {
        return res.status(404).json({msg:"Service not found"})
    }
}

export const syncServicesCafe = async(req, res) =>{
    try {

        const { cafeId, selectedServices } = req.body

        const updatedCafe = await Cafe.findById(cafeId);

        // Verifica si el café existe
        if (!updatedCafe) {
            return res.status(404).json({ msg: "Cafe not found" });
        }

        // Usa Promise.all para esperar a que todas las operaciones asíncronas se completen
        const services = await Promise.all(
            selectedServices.map(async (serviceId) => {
                const service = await Service.findById(serviceId);
                return service; // Devuelve el servicio encontrado
            })
        );

        // Agrega los servicios al café
        updatedCafe.services.push(...services);

        // Guarda el café actualizado en la base de datos
        await updatedCafe.save();

        return res.status(200).json(updatedCafe)
    } catch (error) {
        console.log(error);
        return res.status(404).json({msg:"Error syncing services"})
    }
}

export const syncPricesServicesCafe = async(req, res) =>{
    try {
        const { cafeId, service} = req.body;

        const selectedCafe = await Cafe.findById(cafeId)

        const serviceToUpdate = selectedCafe.services.find(s => s._id == service._id)

        serviceToUpdate.prices = service.prices

        await selectedCafe.save();

        return res.status(200).json({msg:"Prices updated correctly", selectedCafe})
    } catch (error) {
        console.log(error);
        return res.status(404).json({msg:"Error syncing prices services", error})
    }
}