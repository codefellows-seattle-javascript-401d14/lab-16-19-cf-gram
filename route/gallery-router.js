'use strict';


// npm modules
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('exchange-o-gram:gallery-router');

// app modules
const Gallery = require('../model/gallery.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

// module logic
const galleryRouter = module.exports = new Router();

galleryRouter.post('/api/gallery', bearerAuth, jsonParser,  function(req, res, next){
  debug('POST /api/gallery');
  console.log(req.body, 'some other string');
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
  .catch(() => next(createError(404, 'didnt find the gallery')));
});

galleryRouter.delete('/api/gallery/:id', bearerAuth, function(req, res, next){
  debug('DELETE /api/gallery/:id');
  Gallery.findByIdAndRemove(req.params.id)
  .then(() =>  {
    res.status(204).send();
  })

  .catch(err => next(createError(404, err.message)));
});
