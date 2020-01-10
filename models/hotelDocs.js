const mongoose = require('mongoose');
const {Schema} = mongoose;
const Hotel = require('./hotel');

const HotelDocsSchema = new Schema({
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel'},
    nombre: String,
    categoria: String,
    fechaIn: Date,
    fechaOut: Date,
    descripcion: String,
    img: [],
    habitacion: [],
    tipoAlimentacion: [],
    servicios: [],
    noServicios: [],
    penalidades: [],
});

module.exports = HotelDocsSchema;