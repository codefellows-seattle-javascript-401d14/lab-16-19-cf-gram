'use strict';

const Router = require('express').Router;
const multer = require('multer');
const createError = require('http-errors');
const Photo = require('../model/photo.js');
const debug = require('debug')('cfgram:photo-router');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const photoRouter = module.exports = new Router();
const upload = multer({dest: `${__dirname}/../assets/image`});

photoRouter.post('/api/photo', bearerAuth, upload.single('file'), function(req, res, next) {
  debug('POST /api/photo');
  // if(!req.body.title)
  //   return next(createError(400, 'must have a title'));
  //
  // new Photo({
  //   title: req.body.title,
  //   userID: req.user._id.toString(),
  //   albumID: req.album._id.toString(),
  //   photoURI: req.
  // })
  console.log('req.body', req.body);
  console.log('req.file', req.file);
  res.send('hello world');
});
