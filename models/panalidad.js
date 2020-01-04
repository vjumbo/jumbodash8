const mongoose = require('mongoose');
const { Schema} = mongoose;
require('mongoose-type-email');
const SistemaSchema = require('./sistema');


const FechaSchema = new Schema({
    fechasini: Date,
    fechaFin: Date
});

const PenalidadSchema = new Schema({
    nombre: { type: String, required: true},
    fechas: [FechaSchema],
    cancelacionesDias: Number,
    cargo: String,
    descripcion: String,
    sistema: SistemaSchema
});

module.exports = mongoose.model('Penalidad', PenalidadSchema);
