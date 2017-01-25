'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('beergram:gallery-router');

const Gallery = require('../model/gallery.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const galleryRouter = module.exports = new Router();

galleryRouter.post('/api/gallery', bearerAuth, jsonParser,  function(req, res, next){
  debug('POST /api/gallery');
  if(!req.body.title)
    return next(createError(400, 'requires titile'));

  new Gallery({
    title: req.body.title,
    userID: req.user._id.toString(),
  })
  .save()
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
  .catch(err => next(createError(404, 'didnt find the gallery')));
});
