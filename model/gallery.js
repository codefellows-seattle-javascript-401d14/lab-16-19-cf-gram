'use strict';


const mongoose = require('mongoose');

const gallerySchema = mongoose.Schema({
  title: {type: String, required: true},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('gallery', gallerySchema);
