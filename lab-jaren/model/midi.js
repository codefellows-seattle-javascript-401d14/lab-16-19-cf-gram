'use strict';

//const del = require('del');
//const AWS = require('aws-sdk');
const mongoose = require('mongoose');
const Gallery = require('./gallery.js');

//const s3 = new AWS.S3();

const midiSchema = mongoose.Schema({
  title: {type: String, required: true},
  awsKey: {type: String, required: true},
  midiURI: {type: String, required: true},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  galleryID: {type: mongoose.Schema.Types.ObjectId, required: true},
});

midiSchema.pre('save', function(next) {
  Gallery.findById(this.galleryID)
  .then(gallery => {
    gallery.midis.push(this._id.toString());
    return gallery.save();
  })
  .then(() => next())
  .catch(next);
});

// midiSchema.post('save', function(doc, next) {
//   del([`${__dirname}/../assets/midi/*`]);
//   next();
// });

// midiSchema.pre('remove', function(next) {
//   // remove itself from its gallery midis array
//   Gallery.findById(this.galleryID)
//   .then(gallery => {
//     gallery.midis = gallery.midis.filter(midiID => {
//       return midiID != this._id.toString();
//     });
//     return gallery.save();
//   })
//   .then(() => {
//     // delete from AWS
//     return s3.deleteObject({ // fail
//       Bucket: process.env.AWS_BUCKET,
//       Key: this.awsKey,
//     }).promise();
//   })
//   .then(() => next())
//   .catch(next);
// });

module.exports = mongoose.model('midi', midiSchema);
