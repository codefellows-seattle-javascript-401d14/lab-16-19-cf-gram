'use strict';

const Router = require('express').Router;
const User = require('../model/user.js');
const jsonParser = require('body-parser').json();
const debug = require('debug')('gram:signup-route');

const userRouter = module.exports = new Router();

userRouter.post('/api/signup', jsonParser, function(res,req,next){
  debug('POST /api/signup');

  let pwd = req.body.password;
  delete req.body.password;

  new User(req.body)
  .genPWDHash(pwd)
  .then(user => {
    return user.genToken();
  })
  .then(token => res.send(token))
  .catch(next);
});
