'use strict';

const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
  title: {type:String, required:true},
  userID: {type:mongoose.Schema.Types.ObjectId, required:true},
  albumID: {type:mongoose.Schema.Types.ObjectId, requred:true},
  photoURI: {type:String, required:true},
});

module.exports = mongoose.model('photo', photoSchema);
