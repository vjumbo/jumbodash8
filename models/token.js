const mongoose = require('mongoose');
const { Schema} = mongoose;

const TokenSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    hash: { type: String, required: true,index: { unique: true } },
});

module.exports = mongoose.model('Token', TokenSchema);