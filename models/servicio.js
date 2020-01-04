const mongoose = require('mongoose');
const { Schema} = mongoose;
require('mongoose-type-email');
const SistemaSchema = require('./sistema');
const MonedaSchema = require('./moneda');

const ServicioSchema = new Schema({
  nombre: { type: String, required: true},
  descripcion: String,
  costo: {type: Number, min: 0, default: 0},
  moneda: MonedaSchema,
  sistema: SistemaSchema
});

module.exports = mongoose.model('Servicio', ServicioSchema);
