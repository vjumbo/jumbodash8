const { Schema} = require('mongoose');

const FileSchema = new Schema({
  name: String,
  type: String,
  data: String
});

module.exports = FileSchema;
