'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('cf-gram:gallery_router');
const Gallery = require('../model/Gallery');
const bearerAuth = require('../lib/bearer_auth');
const galleryRouter = module.exports = new Router();

galleryRouter.post('/api/gallery', bearerAuth, jsonParser,  function(req, res, next){
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
  .catch(err => {
    if(err) return next(createError(404, 'didn\'t find the gallery'));
  });
});
