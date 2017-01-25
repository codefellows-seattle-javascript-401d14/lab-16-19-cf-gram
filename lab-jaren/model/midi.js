'use strict';

const mongoose = require('mongoose');

const midiSchema = mongoose.Schema({
  title: {type: String, required: true},
  midiURI: {type: String, required: true},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  galleryID: {type: mongoose.Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('midi', midiSchema);
