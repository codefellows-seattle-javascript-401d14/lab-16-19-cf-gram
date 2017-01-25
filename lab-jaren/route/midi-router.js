'use strict';

const multer = require('multer');
const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('cfgram:photo-router');

const Midi = require('../model/midi.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const midiRouter = module.exports = new Router();
const upload = multer({dest: `{__dirname}/../assets/midi`});

midiRouter.post('/api/midi', bearerAuth, upload.single('file'), function(req, res, next) {
  debug('POST /api/midi');
  console.log('req.body', req.body);
  console.log('req.file', req.file);
  res.send('hello world');
});
