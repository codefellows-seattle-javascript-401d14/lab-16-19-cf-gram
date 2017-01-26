'use strict';

const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
  title: {type: String, required: true},
  photoURI: {type: String, required: true},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  galleryID: {type: mongoose.Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('photo', photoSchema);
