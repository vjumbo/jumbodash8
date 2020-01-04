const mongoose = require('mongoose');
const { Schema} = mongoose;
const SistemaSchema = require('./sistema');

const MonedaSchema = new Schema({
    id: String,
    currency_name: String,
    currency_code: String,
    currency_symbol: String,
    defaultid: String,
    conversion_rate: String,
});

module.exports = MonedaSchema;
