const mongoose = require('mongoose');
const {Schema} = mongoose;
const Hotel = require('./hotel');
const FileSchema = require('./file');
const Habitacion = require('./habitacion');

const HotelDocsSchema = new Schema({
    idHotel: String,
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel'},
    nombre: String,
    categoria: String,
    fechaIn: Date,
    fechaOut: Date,
    descripcion: String,
    img: [FileSchema],
    habitaciones: [
        {
            idHab: String,
            cantidad: Number,
            costo: Number,
            moneda: Number,
            habitacion: {type: Schema.Types.ObjectId, ref: 'Habitacion'},
        }
    ],
    tipoAlimentacion: [],
    servicios: [],
    noServicios: [],
    penalidades: [],
});

module.exports = HotelDocsSchema;