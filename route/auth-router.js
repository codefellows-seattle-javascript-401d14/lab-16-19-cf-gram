'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const User = require('../model/user.js');
const debug = require('debug')('cfgram:auth-router');

const userRouter = module.exports = new Router();

userRouter.post('/api/signup', jsonParser, function(req, res, next){
  // next(new Error('ITS BROKEN!!!!!!!!!!!!!!!!!!'));
  debug('POST /api/signup');

  let password = req.body.password;
  delete req.body.password;  //pw doesn't get put into the new User instance

  new User(req.body).generatePasswordHash(password)
  .then(user => {
    return user.generateToken();
  })
  .then(token => res.send(token))
  .catch(next);
});
