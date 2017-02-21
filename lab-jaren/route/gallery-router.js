'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('midigram:gallery-router');

const Gallery = require('../model/gallery.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const galleryRouter = module.exports = new Router();

galleryRouter.post('/api/gallery', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/gallery');
  if(!req.body.title)
    return next(createError(400, 'requires title'));
  if(!req.body.description)
    return next(createError(400, 'requires description'));

  new Gallery({
    title: req.body.title,
    description: req.body.description,
    userID: req.user._id.toString(),
  }).save()
  .then(gallery => res.json(gallery))
  .catch(next);
});

galleryRouter.get('/api/gallery/:id', bearerAuth, function(req, res, next) {
  debug('GET /api/gallery/:id');
  Gallery.findOne({
    userID: req.user._id.toString(),
    _id: req.params.id,
  })
  .populate('midis')
  .then(gallery => res.json(gallery))
  .catch(() => next(createError(404, 'didn\'t find the gallery')));
});

galleryRouter.get('/api/gallery', bearerAuth, function(req, res, next) {
  debug('GET /api/gallery');
  Gallery.find({userID: req.user._id.toString()})
  .populate('midis')
  .then(galleries => res.json(galleries))
  .catch(() => next(createError(404, 'didn\'t find any galleries')));
});

galleryRouter.delete('/api/gallery/:id', bearerAuth, function(req, res, next) {
  debug('DELETE /api/gallery/:id');
  Gallery.findOneAndRemove({
    userID: req.user._id.toString(),
    _id: req.params.id,
  })
  .then(() => res.status(204).send())
  .catch(() => next(createError(404, 'didn\'t find the gallery to remove')));
});

galleryRouter.put('/api/gallery/:id', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT /api/gallery/:id');
  Gallery.findOneAndUpdate({
    userID: req.user._id.toString(),
    _id: req.params.id,
  }, req.body, {new: true})
  .then(gallery => res.json(gallery))
  .catch(() => next(createError(404, 'didn\'t find the gallery')))
  .catch(next);
});
