const mongoose = require('mongoose');
const {Schema} = mongoose;
const Hotel = require('./hotel');
const FileSchema = require('./file');

const HotelDocsSchema = new Schema({
    idHotel: String,
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel'},
    nombre: String,
    categoria: String,
    fechaIn: Date,
    fechaOut: Date,
    descripcion: String,
    img: [FileSchema],
    habitacion: [],
    tipoAlimentacion: [],
    servicios: [],
    noServicios: [],
    penalidades: [],
});

module.exports = HotelDocsSchema;