'use strict';

const multer = require('multer');
const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('cf-gram:gallery_router');

const Photo = require('../model/Photo');
const bearerAuth = require('../lib/bearer_auth');

const photoRouter = module.exports = new Router();
const upload = multer({dest: `${__dirname}/../assets/images`});

photoRouter.post('/api/photo', bearerAuth, upload.single('file'), function(req, res, next) {
  debug('POST /api/photo');
  console.log('req.body', req.body);
  console.log('req.file', req.file);
  res.send('hello world');
  next();
});
