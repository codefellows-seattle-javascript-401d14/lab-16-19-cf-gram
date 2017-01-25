'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('cfgram:login-route');

const Album = require('../model/album.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const albumRouter = module.exports = new Router();

albumRouter.post('/api/album',bearerAuth,jsonParser, function(req,res,next){
  debug('POST /api/album');
  if(!req.body.title)
    return next(createError(400, 'need to input a title in request'));

  new Album({
    title: req.body.title,
    userID: req.user._id.toString(),
  }).save()
  .then(album => res.json(album))
  .catch(next);
});

albumRouter.get('/api/album/:id',bearerAuth, function(req,res,next){
  debug('GET /api/album/:id');
  Album.findOne({
    userID: req.user._id.toString(),
    _id: req.params.id,
  })
  .then(album => res.json(album))
  .catch(err=> next(createError(404, err.message)));
});

albumRouter.delete('/api/album/:id',bearerAuth, function(req,res,next){
  debug('DELETE /api/album/:id');
  Album.findByIdAndRemove(req.params.id)
  .then(() => res.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});
