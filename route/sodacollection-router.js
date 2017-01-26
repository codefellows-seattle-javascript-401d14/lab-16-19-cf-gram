const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('cfgram:auth-router');


const Soda = require('../model/sodacollection.js');
const bearerAuth = require('../lib/bearerAuth-middleware.js');
const sodaRouter = module.exports = new Router();
// const userMocks = require('../test/lib/mockUser.js');


//**********************POST ROUTER************************
sodaRouter.post('/api/sodacollection', bearerAuth, jsonParser, function(req, res, next){
  debug('POST /api/sodacollection');
  if(!req.body.brand)
    return next(createError(400, 'requires brand!'));
  new Soda ({
    brand: 'Coke',
    diet: false,
    taste: 'decent',
    SodaId: req.user._id.toString(),
  }).save()
   .then(sodacollection => res.json(sodacollection))
   .catch(next);
});
