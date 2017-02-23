'use strict';

const fs = require('fs');
const del = require('del');
const path = require('path');
const AWS = require('aws-sdk');
const multer = require('multer');
const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('midigram:midi-router');

const Midi = require('../model/midi.js');
const Gallery = require('../model/gallery.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();
const dataDir = `${__dirname}/../assets/midi`;
const upload = multer({dest: dataDir});

const midiRouter = module.exports = new Router();

function s3Upload(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if(err) return reject(err);
      resolve(data);
    });
  });
}

midiRouter.post('/api/gallery/:galleryID/midis', bearerAuth, upload.single('file'), function(req, res, next) {
  debug('POST /api/gallery/:galleryID/midis');
  // check if the gallery exists
  if(!req.file)
    return next(createError(400, 'no file'));

  let tempGallery, tempMidi;
  //Gallery.findOne({_id: req.params.galleryID, userID: req.user._id.toString()})
  Gallery.findById(req.params.galleryID)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(gallery => {
    return gallery ? Promise.resolve(gallery) : Promise.reject(createError(404, 'no gallery'));
  })
  .then(gallery => {
    tempGallery = gallery;
    // upload the file to s3
    return s3Upload({
      ACL: 'public-read',
      Bucket: process.env.AWS_BUCKET,
      Key: `${req.file.filename}${path.extname(req.file.originalname)}`,
      Body: fs.createReadStream(req.file.path),
    });
  })
  .then(s3Data => {
    // create midi object and store it in mongo
    del([`${dataDir}/*`]);
    return new Midi({
      title: req.body.title,
      //galleryID: req.body.galleryID,
      userID: req.user._id.toString(),
      awsKey: s3Data.Key,
      midiURI: s3Data.Location,
    }).save();
  })
  .then(midi => {
    tempMidi = midi;
    tempGallery.midis.push(midi._id);
    return tempGallery.save();
  })
  .then(() => res.json(tempMidi))
  .catch(err => {
    del([`${dataDir}/*`]);
    next(err);
  });
});

midiRouter.delete('/api/gallery/:galleryID/midis/:midiID', bearerAuth, function(req, res, next) {
  debug('DELETE /api/gallery/:galleryID/midis/:midiID');
  let tempMidi;
  Midi.findOne({
    userID: req.user._id.toString(),
    _id: req.params.midiID,
  })
  .then(midi => {
    if(midi.userID.toString() !== req.user._id.toString())
      return Promise.reject(createError(401, 'user not authorized to delete'));

    tempMidi = midi;
    return Gallery.findById(req.params.galleryID);
  })
  .catch(err => err.status ? Promise.reject(err) : Promise.reject(createError(404, err.message)))
  // .then(gallery => {
  //   return gallery ? Promise.resolve(gallery) : Promise.reject(createError(404, 'no gallery'));
  // })
  .then(gallery => {
    gallery.midis = gallery.midis.filter(id => {
      if(id !== req.params.midiID) return true;
    });
    return gallery.save();
  })
  .then(() => {
    return s3.deleteObject({
      Bucket: 'midigram-dev',
      Key: tempMidi.awsKey,
    }).promise();
  })
  .then(() => {
    return Midi.findByIdAndRemove(req.params.midiID);
  })
  .then(() => res.sendStatus(204))
  .catch(next);
});
