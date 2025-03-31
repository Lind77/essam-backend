import { Router } from "express";
import multer from "multer";
import path from "path";
import xlsx from "xlsx";

import { createDinersExcel } from "../controllers/diner.controller.js";

const __dirname = path.resolve()

const router = Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async(req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ningún archivo." });
    }
  
    try {
      // Leer el archivo Excel
      const filePath = path.join(__dirname, req.file.path);
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
      if (!Array.isArray(sheetData)) {
        return res.status(400).json({ message: "El archivo no contiene datos válidos." });
    }

    // Mapear los datos del archivo Excel al formato esperado por createDiners
    const dinersData = sheetData.map((row) => ({
        name: row.name, // Asegúrate de que "Nombre" sea el nombre de la columna en el Excel
        dni: row.dni,     // Asegúrate de que "DNI" sea el nombre de la columna en el Excel
        businnesClient: row.businnesClient, // Asegúrate de que "Cliente Negocio" sea el nombre de la columna en el Excel
        unit: row.unit,  // Asegúrate de que "Unidad" sea el nombre de la columna en el Excel
        registerCode: row.registerCode
      }));

    // Llamar a createDiners con los datos mapeados
    const createdDiners = await createDinersExcel({ body: dinersData }, res);

    // Responder con éxito
    return res.status(201).json({ message: "Diners creados correctamente.", data: createdDiners });
    } catch (error) {
      console.error("Error al procesar el archivo:", error);
      res.status(500).json({ message: "Error al procesar el archivo." });
    }
  });

export default router