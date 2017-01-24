'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const Player = require('../model/player.js');
const debug = require('debug')('cfgram:auth-router');

const playerRouter = module.exports = new Router();

playerRouter.post('/api/signup', jsonParser, function(req, res, next){
  debug('POST /api/signup');

  let password = req.body.password;
  delete req.body.password;

  let player = new Player(req.body);


  player.generatePasswordHash(password)
  .then(player => player.save())
  .then( player => player.generateToken())
  .then(token => res.send(token))
  .catch(next)
  .catch(next);
});
