'use strict';

const multer = require('multer');
const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('cfgram:photo-router');

const Photo = require('../model/photo.js');
const bearerAuth = require('../lib/bearerAuth-middleware.js');

const photoRotuer = module.exports = new Router();
const upload = multer({dest: `${__dirname}/../assets/image`});

photoRotuer.post('/api/photo', bearerAuth, upload.single('cokepicture'), function(req, res, next) {
  debug('POST api/photo');
  console.log('req.body', req.body);
  console.log('req.file', req.file);

  res.send('you uploaded a coke picture!!');
});
