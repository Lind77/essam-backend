import fs from 'fs';
import { DOMParser, XMLSerializer } from 'xmldom';
import { SignedXml } from 'xml-crypto';
import forge from 'node-forge';

export class Signature {
    /**
     * Sign XML document using a PFX certificate
     * @param {string} flgFirma - Flag indicating which ExtensionContent to use
     * @param {string} ruta - Path to the XML file
     * @param {string} rutaFirma - Path to the PFX certificate
     * @param {string} passFirma - Password for the PFX certificate
     * @returns {Object} - Response with hash and signature values
     */
    async signatureXml(flgFirma, ruta, rutaFirma, passFirma) {
        try {
            if (!fs.existsSync(ruta)) throw new Error(`Archivo XML no encontrado: ${ruta}`);
            if (!fs.existsSync(rutaFirma)) throw new Error(`Certificado no encontrado: ${rutaFirma}`);
    
            const xmlContent = fs.readFileSync(ruta, 'utf-8');
            const doc = new DOMParser().parseFromString(xmlContent, 'application/xml');
    
            const pfxData = fs.readFileSync(rutaFirma, 'binary');
            const p12Asn1 = forge.asn1.fromDer(pfxData, false);
            const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, passFirma);
    
            const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
            if (!keyBags[forge.pki.oids.pkcs8ShroudedKeyBag]?.length) {
                throw new Error('No se encontró la clave privada en el certificado PFX');
            }
    
            const privateKey = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0].key;
            if (!privateKey) throw new Error('La clave privada extraída es inválida');
            const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
            console.log('Private Key:', privateKeyPem); // Debug
    
            const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
            if (!certBags[forge.pki.oids.certBag]?.length) {
                throw new Error('No se encontró el certificado en el archivo PFX');
            }
    
            const cert = certBags[forge.pki.oids.certBag][0].cert;
            const certPem = forge.pki.certificateToPem(cert);
    
            const sig = new SignedXml({
                signatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
                canonicalizationAlgorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'
            });
    
            sig.signingKey = privateKeyPem;
            if (!sig.signingKey) throw new Error('Private key is not set properly');
    
            sig.keyInfoProvider = {
                getKeyInfo: () => {
                    const cleanCert = certPem
                        .replace(/-+BEGIN CERTIFICATE-+\r?\n?/, '')
                        .replace(/-+END CERTIFICATE-+\r?\n?/, '')
                        .replace(/\r?\n|\r/g, '');
                    return `<X509Data><X509Certificate>${cleanCert}</X509Certificate></X509Data>`;
                }
            };
    
            sig.addReference({
                xpath: "//*[local-name(.)='Invoice']",
                transforms: [
                    'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
                    'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'
                ],
                digestAlgorithm: 'http://www.w3.org/2001/04/xmlenc#sha256',
                inclusiveNamespacesPrefixList: ['ds']
            });
    
            sig.computeSignature(xmlContent, {
                location: {
                    reference: `//*[local-name(.)='ExtensionContent'][${parseInt(flgFirma) + 1}]`,
                    action: 'append'
                },
                prefix: 'ds'
            });
    
            const signedXml = sig.getSignedXml();
            const signedDoc = new DOMParser().parseFromString(signedXml, 'application/xml');
            const signatureElement = signedDoc.getElementsByTagName('Signature')[0];
            signatureElement.setAttribute('Id', 'SignatureSP');
    
            const hashCpe = signedDoc.getElementsByTagName('DigestValue')[0].textContent;
            const firmaCpe = signedDoc.getElementsByTagName('SignatureValue')[0].textContent;
    
            const serializer = new XMLSerializer();
            const finalXml = serializer.serializeToString(signedDoc);
            fs.writeFileSync(ruta, finalXml, 'utf-8');
    
            return {
                respuesta: 'ok',
                hash_cpe: hashCpe,
                firma_cpe: firmaCpe,
                xml_firmado: finalXml
            };
        } catch (error) {
            console.error("Error en signature_xml:", error);
            return {
                respuesta: 'error',
                mensaje: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            };
        }
    }
}