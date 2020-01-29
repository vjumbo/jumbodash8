const mongoose = require('mongoose');
const { Schema} = mongoose;
require('mongoose-type-email');
const SistemaSchema = require('./sistema');
const docStatus = require("../def/docStatus");
const Hotel = require('./hotel');
const Vuelos = require('./vuelos');
const HotelDocsSchema = require('./hotelDocs');
autoIncrement = require('mongoose-auto-increment');

const DocsSchema = new Schema({
    id: Schema.Types.ObjectId,
    idQuote: { type: String, required: true},
    crmPotential: {},
    status: { type: String, enum: docStatus, required: true},
    fechaElaboracion: Date,
    asesor: String,
    oficina: String,
    telefono: String,
    emailAsesor: String,
    cliente: {},
    nombreCliente: String,
    telefonoCliente: String,
    emailCliente: String,
    autorizaPublicidad: {type: Boolean, default: false},
    cirugia: {type: Boolean, default: false},
    embarazo: {type: Boolean, default: false},
    otro: String,
    destino: String,
    tipoCotizacion: String,
    hoteles: [HotelDocsSchema],
    totalHoteles: Number,
    planIncluye: String,
    planNoIncluye: String,
    totalMoneda: {},
    chd: Number,
    chdValor: Number,
    chdValorTotal: Number,
    adult: Number,
    adultValor: Number,
    adultValorTotal: Number,
    inf: Number,
    infValor: Number,
    infValorTotal: Number,
    vuelos: [Vuelos],
    horaSalida: String,
    horaSalidaPresentarseAeropuerto: String,
    horaRetorno: String,
    horaRetornoPresentarseAeropuerto: String,
    tipoTarifa: String,
    reembolsable: {type: Boolean, default: false},
    cambioNombre: String,
    sistema: SistemaSchema,
});
autoIncrement.initialize(mongoose.connection);
DocsSchema.plugin(autoIncrement.plugin, { model: 'Docs', field: 'idQuote', startAt: 100000 });

module.exports = mongoose.model('Docs', DocsSchema);
