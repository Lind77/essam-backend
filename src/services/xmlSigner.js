import { SignedXml } from 'xml-crypto';
import { DOMParser } from 'xmldom';
import fs from 'fs';
import path from 'path';
import pem from 'pem';
import { json } from 'express';

export const signXml = async (XMLRoute, certPath, certPass) => {
    try {
        const xml = fs.readFileSync(XMLRoute, 'utf-8');
        const JSONPerm = await createPEMfromPFX(certPath, certPass);
        
        // Configuración corregida según el ejemplo válido
        const transf = [
            'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
            'http://www.w3.org/TR/2001/REC-xml-c14n-20010315' // ¡Esta línea es clave!
          ];
        
        const sig = new SignedXml();

        sig.canonicalizationAlgorithm = 'http://www.w3.org/2001/10/xml-exc-c14n#';
        sig.signatureAlgorithm = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1';

        
          sig.addReference(
            "//*[local-name()='Invoice']", // Nodo donde se insertará la firma
            transf,
            'http://www.w3.org/2000/09/xmldsig#sha1', // DigestMethod SHA-1
            '', // URI vacío como en el ejemplo
            '', // No digestValue (se calcula)
            '', // No inclusive namespaces
            true // Para insertar la firma en el nodo ExtensionContent
          );
        
          sig.signingKey = Buffer.from(JSONPerm.value.key, 'utf8')
        sig.keyInfoProvider = KeyInfoProvider(JSONPerm.value);

    
        
        // Configuración de ubicación y ID como en el ejemplo
        sig.computeSignature(xml, {
            location: { 
                reference: "//*[local-name()='ExtensionContent']",
                action: 'append'
            },
            prefix: 'ds',
            attrs: { Id: 'SignatureSP' }
        });
        
        const __signedXML = sig.getSignedXml();
        await crearXML(XMLRoute, __signedXML);
        
    } catch (error) {
        console.error("Error signing XML:", error);
        throw error; // Mejor lanzar el error que devolver una respuesta HTTP aquí
    }
};

export const createPEMfromPFX = async (ruta_certif, pin_certif) => {
    return new Promise((resolve, reject) => {
        try {
            pem.config({
                pathOpenSSL: path.resolve('./openssl/bin/openssl')
            });
            const pfx = fs.readFileSync(ruta_certif);
            pem.readPkcs12(pfx, { p12Password: pin_certif }, (err, new_pem) => {
                if (err) {
                    return reject(new Error(`Error in pem.readPkcs12: ${err.message}`));
                }
                return resolve({ value: new_pem });
            });
        } catch (err) {
            return reject(new Error(`Error creating PEM: ${err.message}`));
        }
    });
};

export const KeyInfoProvider = (pem) => {
    return {
		getKey() {
			const cert = this.getCert();
		  	return `<ds:X509Data><ds:X509Certificate>${cert}</ds:X509Certificate></ds:X509Data>`;
		},
		getKeyInfo() {
			  const cert = this.getCert();
		  	  return `<ds:X509Data><ds:X509Certificate>${cert}</ds:X509Certificate></ds:X509Data>`;
		},
		getCert() {
		  	try {
				return pem.cert
                .replace(/-----BEGIN CERTIFICATE-----/g, '')
                .replace(/-----END CERTIFICATE-----/g, '')
                .replace(/\r?\n|\r/g, '');
		  	} catch (err) {
				throw Error(err);
		 	}
		}
	};
}

export const crearXML = (rutaFile, xmlData) => {
	return new Promise( (resolve, reject) => {
		try {
			fs.writeFileSync(rutaFile, xmlData, 'utf8');
			return resolve({ msj : 'Se creo el xml' });
		} catch(err) {
			return reject({ err : err, msj : 'Hubo un error al crear el XML' });
		}
	});
}