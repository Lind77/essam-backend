import { create } from "xmlbuilder2";

export const generateXML = (factura) => {
    const doc = create({ version: '1.0', encoding: 'utf-8' })
  .ele('Invoice', {
    'xmlns': 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
    'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
    'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
    'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
    'xmlns:ext': 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2'
  })
    .ele('ext:UBLExtensions')
      .ele('ext:UBLExtension')
        .ele('ext:ExtensionContent').up()
      .up()
    .up()
    .ele('cbc:UBLVersionID').txt('2.1').up()
    .ele('cbc:CustomizationID', { schemeAgencyName: 'PE:SUNAT' }).txt('2.0').up()
    .ele('cbc:ProfileID', { 
      schemeName: 'Tipo de Operacion',
      schemeAgencyName: 'PE:SUNAT',
      schemeURI: 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo17'
    }).txt(factura.cabecera.tipo_operacion).up()
    .ele('cbc:ID').txt(`${factura.cabecera.serie}-${factura.cabecera.correlativo}`).up()
    .ele('cbc:IssueDate').txt(factura.cabecera.fecha_emision).up()
    .ele('cbc:IssueTime').txt(factura.cabecera.hora_emision).up()
    .ele('cbc:DueDate').txt(factura.cabecera.fecha_vencimiento).up()
    .ele('cbc:InvoiceTypeCode', {
      listAgencyName: 'PE:SUNAT',
      listName: 'Tipo de Documento',
      listURI: 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01',
      listID: '0101',
      name: 'Tipo de Operacion'
    }).txt(factura.cabecera.tipo_comprobante).up()
    .ele('cbc:DocumentCurrencyCode', {
      listID: 'ISO 4217 Alpha',
      listName: 'Currency',
      listAgencyName: 'United Nations Economic Commission for Europe'
    }).txt(factura.cabecera.moneda).up()
    .ele('cbc:LineCountNumeric').txt(factura.items.length).up()
    .ele('cac:Signature')
      .ele('cbc:ID').txt(`${factura.cabecera.serie}-${factura.cabecera.correlativo}`).up()
      .ele('cac:SignatoryParty')
        .ele('cac:PartyIdentification')
          .ele('cbc:ID').txt(factura.emisor.ruc).up()
        .up()
        .ele('cac:PartyName')
          .ele('cbc:Name').dat(factura.emisor.razon_social).up()
        .up()
      .up()
      .ele('cac:DigitalSignatureAttachment')
        .ele('cac:ExternalReference')
          .ele('cbc:URI').txt('#SignatureSP').up()
        .up()
      .up()
    .up()
    .ele('cac:AccountingSupplierParty')
      .ele('cac:Party')
        .ele('cac:PartyIdentification')
          .ele('cbc:ID', {
            schemeID: factura.emisor.tipo_documento,
            schemeName: 'Documento de Identidad',
            schemeAgencyName: 'PE:SUNAT',
            schemeURI: 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06'
          }).txt(factura.emisor.ruc).up()
        .up()
        .ele('cac:PartyName')
          .ele('cbc:Name').dat(factura.emisor.razon_social).up()
        .up()
        .ele('cac:PartyTaxScheme')
          .ele('cbc:RegistrationName').dat(factura.emisor.razon_social).up()
          .ele('cbc:CompanyID', {
            schemeID: factura.emisor.tipo_documento,
            schemeName: 'SUNAT:Identificador de Documento de Identidad',
            schemeAgencyName: 'PE:SUNAT',
            schemeURI: 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06'
          }).txt(factura.emisor.ruc).up()
          .ele('cac:TaxScheme')
            .ele('cbc:ID', {
              schemeID: factura.emisor.tipo_documento,
              schemeName: 'SUNAT:Identificador de Documento de Identidad',
              schemeAgencyName: 'PE:SUNAT',
              schemeURI: 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06'
            }).txt(factura.emisor.ruc).up()
          .up()
        .up()
        .ele('cac:PartyLegalEntity')
          .ele('cbc:RegistrationName').dat(factura.emisor.razon_social).up()
          .ele('cac:RegistrationAddress')
            .ele('cbc:ID', { schemeName: 'Ubigeos', schemeAgencyName: 'PE:INEI' }).txt(factura.emisor.ubigeo).up()
            .ele('cbc:AddressTypeCode', { 
              listAgencyName: 'PE:SUNAT',
              listName: 'Establecimientos anexos'
            }).txt(factura.cabecera.anexo_sucursal).up()
            .ele('cbc:CityName').dat(factura.emisor.provincia).up()
            .ele('cbc:CountrySubentity').dat(factura.emisor.departamento).up()
            .ele('cbc:District').dat(factura.emisor.distrito).up()
            .ele('cac:AddressLine')
              .ele('cbc:Line').dat(factura.emisor.direccion).up()
            .up()
            .ele('cac:Country')
              .ele('cbc:IdentificationCode', {
                listID: 'ISO 3166-1',
                listAgencyName: 'United Nations Economic Commission for Europe',
                listName: 'Country'
              }).txt('PE').up()
            .up()
          .up()
        .up()
        .ele('cac:Contact')
          .ele('cbc:Name').dat('').up()
        .up()
      .up()
    .up()
    .ele('cac:AccountingCustomerParty')
      .ele('cac:Party')
        .ele('cac:PartyIdentification')
          .ele('cbc:ID', {
            schemeID: factura.cliente.tipo_documento,
            schemeName: 'Documento de Identidad',
            schemeAgencyName: 'PE:SUNAT',
            schemeURI: 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06'
          }).txt(factura.cliente.ruc).up()
        .up()
        .ele('cac:PartyName')
          .ele('cbc:Name').dat(factura.cliente.razon_social).up()
        .up()
        .ele('cac:PartyTaxScheme')
          .ele('cbc:RegistrationName').dat(factura.cliente.razon_social).up()
          .ele('cbc:CompanyID', {
            schemeID: factura.cliente.tipo_documento,
            schemeName: 'SUNAT:Identificador de Documento de Identidad',
            schemeAgencyName: 'PE:SUNAT',
            schemeURI: 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06'
          }).txt(factura.cliente.ruc).up()
          .ele('cac:TaxScheme')
            .ele('cbc:ID', {
              schemeID: factura.cliente.tipo_documento,
              schemeName: 'SUNAT:Identificador de Documento de Identidad',
              schemeAgencyName: 'PE:SUNAT',
              schemeURI: 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06'
            }).txt(factura.cliente.ruc).up()
          .up()
        .up()
        .ele('cac:PartyLegalEntity')
          .ele('cbc:RegistrationName').dat(factura.cliente.razon_social).up()
          .ele('cac:RegistrationAddress')
            .ele('cbc:ID', { schemeName: 'Ubigeos', schemeAgencyName: 'PE:INEI' }).up()
            .ele('cbc:CityName').dat('').up()
            .ele('cbc:CountrySubentity').dat('').up()
            .ele('cbc:District').dat('').up()
            .ele('cac:AddressLine')
              .ele('cbc:Line').dat(factura.cliente.direccion).up()
            .up()
            .ele('cac:Country')
              .ele('cbc:IdentificationCode', {
                listID: 'ISO 3166-1',
                listAgencyName: 'United Nations Economic Commission for Europe',
                listName: 'Country'
              }).up()
            .up()
          .up()
        .up()
      .up()
    .up()
    .ele('cac:PaymentTerms')
      .ele('cbc:ID').txt('FormaPago').up()
      .ele('cbc:PaymentMeansID').txt(factura.cabecera.forma_pago).up()
      .ele('cbc:Amount', { currencyID: factura.cabecera.moneda }).txt(factura.cabecera.monto_credito).up()
    .up();

    // Agregar cuotas
    factura.cuotas.forEach(v => {
      doc.ele('cac:PaymentTerms')
          .ele('cbc:ID').txt('FormaPago').up()
          .ele('cbc:PaymentMeansID').txt(`Cuota${v.numero}`).up()
          .ele('cbc:Amount', { currencyID: factura.cabecera.moneda }).txt(v.importe).up()
          .ele('cbc:PaymentDueDate').txt(v.vencimiento).up()
        .up();
    });

  // Continuar con el resto del XML
  doc.ele('cac:TaxTotal')
      .ele('cbc:TaxAmount', { currencyID: factura.cabecera.moneda }).txt(factura.cabecera.total_impuestos).up()
      .ele('cac:TaxSubtotal')
        .ele('cbc:TaxableAmount', { currencyID: factura.cabecera.moneda }).txt(factura.cabecera.total_op_gravadas).up()
        .ele('cbc:TaxAmount', { currencyID: factura.cabecera.moneda }).txt(factura.cabecera.igv).up()
        .ele('cac:TaxCategory')
          .ele('cbc:ID', {
            schemeID: 'UN/ECE 5305',
            schemeName: 'Tax Category Identifier',
            schemeAgencyName: 'United Nations Economic Commission for Europe'
          }).txt('S').up()
          .ele('cac:TaxScheme')
            .ele('cbc:ID', { schemeID: 'UN/ECE 5153', schemeAgencyID: '6' }).txt('1000').up()
            .ele('cbc:Name').txt('IGV').up()
            .ele('cbc:TaxTypeCode').txt('VAT').up()
          .up()
        .up()
      .up();

if (factura.cabecera.total_op_exoneradas > 0) {
  doc.ele('cac:TaxSubtotal')
      .ele('cbc:TaxableAmount', { currencyID: factura.cabecera.moneda }).txt(factura.cabecera.total_op_exoneradas).up()
      .ele('cbc:TaxAmount', { currencyID: factura.cabecera.moneda }).txt(factura.cabecera.igv).up()
      .ele('cac:TaxCategory')
        .ele('cbc:ID', {
          schemeID: 'UN/ECE 5305',
          schemeName: 'Tax Category Identifier',
          schemeAgencyName: 'United Nations Economic Commission for Europe'
        }).txt('E').up()
        .ele('cac:TaxScheme')
          .ele('cbc:ID', { schemeID: 'UN/ECE 5153', schemeAgencyID: '6' }).txt('9997').up()
          .ele('cbc:Name').txt('EXO').up()
          .ele('cbc:TaxTypeCode').txt('VAT').up()
        .up()
      .up()
    .up();
}

if (factura.cabecera.total_op_inafectas > 0) {
  doc.ele('cac:TaxSubtotal')
      .ele('cbc:TaxableAmount', { currencyID: factura.cabecera.moneda }).txt(factura.cabecera.total_op_inafectas).up()
      .ele('cbc:TaxAmount', { currencyID: factura.cabecera.moneda }).txt('0.00').up()
      .ele('cac:TaxCategory')
        .ele('cbc:ID', {
          schemeID: 'UN/ECE 5305',
          schemeName: 'Tax Category Identifier',
          schemeAgencyName: 'United Nations Economic Commission for Europe'
        }).txt('O').up()
        .ele('cac:TaxScheme')
          .ele('cbc:ID', { schemeID: 'UN/ECE 5153', schemeAgencyID: '6' }).txt('9998').up()
          .ele('cbc:Name').txt('INA').up()
          .ele('cbc:TaxTypeCode').txt('FRE').up()
        .up()
      .up()
    .up();
}

if (factura.cabecera.icbper > 0) {
  doc.ele('cac:TaxSubtotal')
      .ele('cbc:TaxAmount', { currencyID: factura.cabecera.moneda }).txt(factura.cabecera.icbper).up()
      .ele('cac:TaxCategory')
        .ele('cac:TaxScheme')
          .ele('cbc:ID', { schemeID: 'UN/ECE 5153', schemeAgencyID: '6' }).txt('7152').up()
          .ele('cbc:Name').txt('ICBPER').up()
          .ele('cbc:TaxTypeCode').txt('OTH').up()
        .up()
      .up()
    .up();
}

doc.ele('cac:LegalMonetaryTotal')
    .ele('cbc:LineExtensionAmount', { currencyID: factura.cabecera.moneda })
        .txt(factura.cabecera.total_antes_impuestos)
    .up()
    .ele('cbc:TaxInclusiveAmount', { currencyID: factura.cabecera.moneda })
        .txt(factura.cabecera.total_despues_impuestos)
    .up()
    .ele('cbc:PayableAmount', { currencyID: factura.cabecera.moneda })
        .txt(factura.cabecera.total_a_pagar)
    .up()
.up();

// Agregar factura.items
factura.items.forEach(v => {
  const item = doc.ele('cac:InvoiceLine')
    .ele('cbc:ID').txt(v.item).up()
    .ele('cbc:InvoicedQuantity', {
      unitCode: v.unidad,
      unitCodeListID: 'UN/ECE rec 20',
      unitCodeListAgencyName: 'United Nations Economic Commission for Europe'
    }).txt(v.cantidad).up()
    .ele('cbc:LineExtensionAmount', { currencyID: factura.cabecera.moneda }).txt(v.total_antes_impuestos).up()
    .ele('cac:PricingReference')
      .ele('cac:AlternativeConditionPrice')
        .ele('cbc:PriceAmount', { currencyID: factura.cabecera.moneda }).txt(v.precio_lista).up()
        .ele('cbc:PriceTypeCode', {
          listName: 'Tipo de Precio',
          listAgencyName: 'PE:SUNAT',
          listURI: 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo16'
        }).txt('01').up()
      .up()
    .up()
    .ele('cac:TaxTotal')
      .ele('cbc:TaxAmount', { currencyID: factura.cabecera.moneda }).txt(v.total_impuestos).up()
      .ele('cac:TaxSubtotal')
        .ele('cbc:TaxableAmount', { currencyID: factura.cabecera.moneda }).txt(v.valor_total).up()
        .ele('cbc:TaxAmount', { currencyID: factura.cabecera.moneda }).txt(v.igv).up()
        .ele('cac:TaxCategory')
          .ele('cbc:ID', {
            schemeID: 'UN/ECE 5305',
            schemeName: 'Tax Category Identifier',
            schemeAgencyName: 'United Nations Economic Commission for Europe'
          }).txt(v.codigos[0]).up()
          .ele('cbc:Percent').txt('18').up()
          .ele('cbc:TaxExemptionReasonCode', {
            listAgencyName: 'PE:SUNAT',
            listName: 'Afectacion del IGV',
            listURI: 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo07'
          }).txt(v.codigos[1]).up()
          .ele('cac:TaxScheme')
            .ele('cbc:ID', {
              schemeID: 'UN/ECE 5153',
              schemeName: 'Codigo de tributos',
              schemeAgencyName: 'PE:SUNAT'
            }).txt(v.codigos[2]).up()
            .ele('cbc:Name').txt(v.codigos[3]).up()
            .ele('cbc:TaxTypeCode').txt(v.codigos[4]).up()
          .up()
        .up()
      .up();

  if (v.icbper > 0) {
    item.ele('cac:TaxSubtotal')
        .ele('cbc:TaxAmount', { currencyID: factura.cabecera.moneda }).txt(v.icbper).up()
        .ele('cbc:BaseUnitMeasure', { unitCode: v.unidad }).txt(v.cantidad).up()
        .ele('cac:TaxCategory')
          .ele('cbc:PerUnitAmount', { currencyID: factura.cabecera.moneda }).txt(v.factor_icbper).up()
          .ele('cac:TaxScheme')
            .ele('cbc:ID').txt('7152').up()
            .ele('cbc:Name').txt('ICBPER').up()
            .ele('cbc:TaxTypeCode').txt('OTH').up()
          .up()
        .up()
      .up();
  }

  item.up() // Cierra TaxTotal
    .ele('cac:Item')
      .ele('cbc:Description').dat(v.nombre).up()
      .ele('cac:SellersItemIdentification')
        .ele('cbc:ID').dat('195').up()
      .up()
      .ele('cac:CommodityClassification')
        .ele('cbc:ItemClassificationCode', {
          listID: 'UNSPSC',
          listAgencyName: 'GS1 US',
          listName: 'Item Classification'
        }).txt('10191509').up()
      .up()
    .up()
    .ele('cac:Price')
      .ele('cbc:PriceAmount', { currencyID: factura.cabecera.moneda }).txt(v.valor_unitario).up()
    .up()
  .up();
});

const xml = doc.end({ prettyPrint: true });

    return xml.toString();
};