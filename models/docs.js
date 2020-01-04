const mongoose = require('mongoose');
const { Schema} = mongoose;
require('mongoose-type-email');
const SistemaSchema = require('./sistema');
const docStatus = require("../def/docStatus");
const Hotel = require('./hotel');
const Vuelos = require('./vuelos');

const DocsSchema = new Schema({
    id: Schema.Types.ObjectId,
    idQuote: { type: String, required: true},
    crmPotential: {},
    status: { type: String, enum: docStatus, required: true},
    fechaElaboracion: Date,
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
    destino: String,
    tipoCotizacion: String,
    hoteles: [{
        hotel: {},
        habitacion: [{}],

    }],
    planIncluye: String,
    planNoIncluye: String,
    chd: Number,
    chdValor: Number,
    chdValorTotal: Number,
    adult: Number,
    adultValor: Number,
    adultValorTotal: Number,
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

module.exports = mongoose.model('Docs', DocsSchema);
