'use strict';

const multer = require('multer');
const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('exchange-o-gram: photo-router');

const Photo = require('../model/photo.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const photoRouter = module.exports = new Router();
const upload = multer({dest: `${__dirname}/../assets/image`});

photoRouter.post('/api/photo', bearerAuth, upload.single('file'), function(req, res, next) {
  debug('POST /api/photo');
  console.log('req.body', req.body);
  console.log('req.file', req.file);

  res.send('Hello World!');
});
