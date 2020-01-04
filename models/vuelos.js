const mongoose = require('mongoose');
const { Schema} = mongoose;

const VuelosSchema = new Schema({
    id: Schema.Types.ObjectId,
    aerolinea: String,
    vuelo: String,
    fecha: String,
    origen: String,
    destino: String,
    sale: String,
    llega: String,
    numeroBoleto: String,
});

module.exports = VuelosSchema;