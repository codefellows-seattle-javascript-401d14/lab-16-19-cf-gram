'use strict';

//npm stuffs
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('cfgram:gallery-router');

//app modules stuffs
const Gallery = require('../model/gallery.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

//module logic
const galleryRouter = module.exports = new Router();

galleryRouter.post('/api/gallery', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/gallery');
  if(!req.body.title)
    return next(createError(400, 'requires title'));

  new Gallery({
    title: req.body.title,
    userID: req.user._id.toString(),
  }).save()
    .then(gallery => res.json(gallery))
    .catch(next);
});

galleryRouter.get('/api/gallery/:id', bearerAuth, function(req, res, next){
  debug('GET /api/gallery/:id');

  Gallery.findOne({
    userID: req.user._id.toString(),
    _id: req.params.id,
  })
  .then(gallery => res.json(gallery))
  .catch(err => next(createError(404, 'didn\'t find the gallery')));
});

galleryRouter.delete('/api/gallery/:id', bearerAuth, function(req, res, next) {
  debug('DELETE /api/gallery/:id');
  Gallery.findByIdAndRemove(req.params.id)
  .then(() => {
    res.status(204).send();
  })
  .catch(err => next(createError(404, err.message)));
});
