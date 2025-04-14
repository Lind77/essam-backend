import { create } from "xmlbuilder2";
import path from "path";
import { promises as fs, readFileSync, writeFileSync } from "fs";
import { generateXML } from "../services/sunat.services.js";
import { signXml } from "../services/xmlSigner.js";
import AdmZip from "adm-zip";
import { XMLParser } from 'fast-xml-parser';
import axios from "axios";


const __dirname = path.resolve()

export const createInvoice = async(req, res) => {
    try {
        const { rucEmisor, razonSocialEmisor, rucCliente, razonSocialCliente, serie, correlativo, fechaEmision, moneda, total } = req.body;


        const cabecera = {
            serie: "F001",
            correlativo: correlativo,
            fecha_emision: "2022-08-13",
            hora_emision: "12:04:21",
            fecha_vencimiento: "2022-08-30",
            tipo_comprobante: "01",
            tipo_operacion: "0101",
            moneda: "PEN",
            forma_pago: "Credito",
            monto_credito: "70.8",
            total_impuestos: "10.80",
            total_op_gravadas: "60",
            igv: "10.80",
            total_antes_impuestos: "60",
            total_despues_impuestos: "70.8",
            total_a_pagar: "70.8",
            anexo_sucursal: "0000"
        }

        const emisor = {
            ruc: "20607599727",
            tipo_documento: "6",
            razon_social: "INSTITUTO INTERNACIONAL DE SOFTWARE SAC",
            nombre_comercial: "",
            ubigeo: "140101",
            direccion: "8 DE OCTUBRE N 123 - CHICLAYO - CHICLAYO - LAMBAYEQUE",
            departamento: "LAMBAYEQUE",
            provincia: "CHICLAYO",
            distrito: "CHICLAYO",
            usuario_emisor :"MODDATOS",
            clave_emisor :"MODDATOS"
        }
        const cliente = {
            ruc: "20602814425",
            tipo_documento: "6",
            razon_social: "TAQINI TECHNOLOGY S.A.C.",
            direccion: "AV.OCHO DE OCTUBRE NRO. 274 LAMBAYEQUE - LAMBAYEQUE - LAMBAYEQUE"
        }
        const cuotas = [
            { numero: "001", importe: "24", vencimiento: "2022-08-31" },
            { numero: "002", importe: "24", vencimiento: "2022-09-27" },
            { numero: "003", importe: "22.80", vencimiento: "2022-11-01" }
        ]
        const items = [
            {
            item: 1,
            cantidad: "4",
            nombre: "ACEITE",
            cantidad: "4",
            unidad: "NIU",
            valor_unitario: "5",
            valor_total: "20",
            igv: 3.60,
    	    icbper: 0.00,
            factor_icbper: 0.50,
            total_antes_impuestos: "20",
            total_impuestos: "3.60",
            precio_lista: "5.9",
            codigos: ["S", "10", "1000", "IGV", "VAT"]
            },
            {
            item: "2",
            nombre: "JABON",
            cantidad: "5",
            unidad: "NIU",
            valor_unitario: "3",
            valor_total: "15",
            igv: 2.70,
    	    icbper: 0.00,
            factor_icbper: 0.50,
            total_antes_impuestos: "15",
            total_impuestos: "2.70",
            precio_lista: "3.54",
            codigos: ["S", "10", "1000", "IGV", "VAT"]
            },
            {
            item: "3",
            nombre: "CUADERNO",
            cantidad: "5",
            unidad: "NIU",
            valor_unitario: "5",
            valor_total: "25",
            igv: 4.50,
    	    icbper: 0.00,
            factor_icbper: 0.50,
            total_antes_impuestos: "25",
            total_impuestos: "4.50",
            precio_lista: "5.9",
            codigos: ["S", "10", "1000", "IGV", "VAT"]
            }
        ]

          const factura = {
            cabecera, items, emisor, cliente, cuotas, rucEmisor, razonSocialEmisor, 
            rucCliente, razonSocialCliente, serie, correlativo, fechaEmision, moneda, total 
            };

            const xmlGenerated = generateXML(factura)

            const fileNameXML = `${factura.emisor.ruc}-${cabecera.tipo_comprobante}-${cabecera.serie}-${cabecera.correlativo}.xml`;

            const {filePath} = await generateXMLFile(xmlGenerated, fileNameXML)

            const result = await signXml(
                filePath,
                './certificated/newcert.pfx',
                'institutoisi'
            );  

            await zipXMLSigned(filePath,'./facturas/' + fileNameXML.replace('.xml', '.zip'))

            await sendXMLtoSUNAT(fileNameXML.replace('.xml', '.zip'), './facturas/' + fileNameXML.replace('.xml', '.zip'), emisor)
            

            res.status(200).json({ 
                message: 'Factura generada correctamente'
            });

    } catch (error) {
        console.error('Error en createInvoice:', error);
        res.status(500).json({ 
            error: 'Error al crear factura',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

export const generateXMLFile = async(xmlString, nameFile) => {

    try {
        const folderPath = path.join(__dirname, 'facturas');
    
        const filePath = path.join(folderPath, nameFile);

        await fs.mkdir(folderPath, { recursive: true });
        writeFileSync(filePath, xmlString, 'utf-8');

        console.log(`Archivo XML guardado en: ${filePath}`);
        return { success: true, filePath: filePath };
    } catch (error) {
        console.error('Error al generar XML:', error);
        return { success: false, error };
    }
}

export const zipXMLSigned = async(filePath, outputURL) =>{
    try {
        const zip = new AdmZip();
        zip.addLocalFile(filePath)
        zip.writeZip(outputURL)
    } catch (error) {
        console.log('Hubo un error al comprimir el archivo XML firmado:', error);
    }
}   

export const sendXMLtoSUNAT = async(nombreZip, fileNameZIP, emisor) => {
  const contenidoZip = readFileSync(fileNameZIP);
  const contenidoZipBase64 = contenidoZip.toString('base64');

  const soapXML = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
  xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" 
  xmlns:ser="http://service.sunat.gob.pe" 
  xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
  <soapenv:Header>
      <wsse:Security>
          <wsse:UsernameToken>
              <wsse:Username>${emisor.ruc}${emisor.usuario_emisor}</wsse:Username>
              <wsse:Password>${emisor.clave_emisor}</wsse:Password>
          </wsse:UsernameToken>
      </wsse:Security>
  </soapenv:Header>
  <soapenv:Body>
      <ser:sendBill>
          <fileName>${nombreZip}</fileName>
          <contentFile>${contenidoZipBase64}</contentFile>
      </ser:sendBill>
  </soapenv:Body>
</soapenv:Envelope>
`;

  // Extract XML filename without extension for CDR processing
  const nombreXml = nombreZip.replace('.zip', '');
  const carpetaCdr = 'cdr/'; // Assuming this is your CDR directory

  try {
      const response = await axios.post(
          'https://e-beta.sunat.gob.pe/ol-ti-itcpfegem-beta/billService',
          soapXML,
          {
              headers: {
                  'Content-Type': 'text/xml; charset=utf-8',
                  'Accept': 'text/xml',
                  'Cache-Control': 'no-cache',
                  'Pragma': 'no-cache',
                  'SOAPAction': '',
                  'Content-Length': Buffer.byteLength(soapXML)
              },
              responseType: 'text',
              timeout: 30000, // Extended from 10000 to 30000 as in the PHP script
              /* httpsAgent: new (require('https').Agent)({
                  rejectUnauthorized: true,
                  ca: fs.readFileSync(path.join(__dirname, "cacert.pem"))
              }) */
          }
      );

      if (response.status === 200) {
          // Guardar respuesta completa
          
          const xmlResponse = response.data;
          const xmlPath = path.join(carpetaCdr, 'respuesta.XML');
          writeFileSync(xmlPath, xmlResponse);

          const parser = new XMLParser({
                ignoreAttributes: false,
                isArray: (name, jpath, isLeafNode, node) => {
                    // Forzar como array solo estos elementos
                    return ['br:sendBillResponse'].includes(name);
                }
            });

          const parsed = parser.parse(xmlResponse);

          const sendBillResponse = parsed['soap-env:Envelope']?.['soap-env:Body']?.['br:sendBillResponse'];

          const applicationResponse = Array.isArray(sendBillResponse) 
                ? sendBillResponse[0]?.applicationResponse 
                : sendBillResponse?.applicationResponse;

          if (applicationResponse) {
              const cdrBuffer = Buffer.from(applicationResponse, 'base64');
              const zipCdrPath = path.join(carpetaCdr, 'R-' + nombreZip);
              writeFileSync(zipCdrPath, cdrBuffer);

              const zip = new AdmZip(zipCdrPath);
              const extractPath = path.join(carpetaCdr, 'R-' + nombreXml);
              zip.extractAllTo(extractPath, true);

              // Leer el XML extraído del CDR
              const xmlCdrFile = path.join(extractPath, `R-${nombreXml}.XML`);
              const xmlCdrContent = readFileSync(xmlCdrFile, 'utf-8');
              

              const secondParser = new XMLParser({
                ignoreAttributes: false,
                isArray: (name, jpath, isLeafNode, node) => {
                    // Forzar como array solo estos elementos
                    return ['cac:Response'].includes(name);
                }
                });

                const cdrParsed = secondParser.parse(xmlCdrContent);

                

              const responseCode = cdrParsed?.['ar:ApplicationResponse']?.['cac:DocumentResponse']?.['cac:Response'];
              

              const responseCodeProcessed = Array.isArray(responseCode) 
                ? responseCode[0]?.['cbc:ResponseCode']	
                : responseCode?.['cbc:ResponseCode'];


              const description = Array.isArray(responseCode) 
              ? responseCode[0]?.['cbc:Description']	
              : responseCode?.['cbc:Description'];

              if (responseCodeProcessed == '0') {
                  console.log('FACTURA APROBADA');
              } else {
                  console.log(`FACTURA RECHAZADA CON CODIGO DE ERROR: ${responseCode}`);
              }

              console.log(description);

          } else {
              const fault = parsed['soapenv:Envelope']?.['soapenv:Body']?.['SOAP-ENV:Fault'];
              const code = fault?.faultcode;
              const message = fault?.faultstring;
              console.error(`Error ${code}: ${message}`);
          }
      } else {
          console.error('Problema de conexión con SUNAT:', response.status);
      }
  } catch (error) {
      console.error('Error al enviar a SUNAT:', error);
      if (error.response?.data) {
          console.error('Respuesta de error:', error.response.data);
      }
  }
};



