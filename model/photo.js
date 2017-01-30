const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
  title: {type: String, required: true },
  photoURI:{type: String, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
  SodaId: {type: mongoose.Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('photo', photoSchema);
