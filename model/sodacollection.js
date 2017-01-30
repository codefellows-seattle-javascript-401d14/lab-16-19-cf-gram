'use strict';

const mongoose = require('mongoose');

const sodacollection = mongoose.Schema({
  brand: {type: String, required: true },
  diet:  {type: Boolean, required: true},
  taste: {type: String, required:false },
  SodaId: {type: mongoose.Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('sodacollection', sodacollection);
