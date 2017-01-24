'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const User = require('../model/User.js');
const debug = require('debug')('cf-gram:auth_router');

const UserRouter = module.exports = new Router();

UserRouter.post('/api/signup', jsonParser, function(req, res, next){
  debug('POST /api/signup');
  let pw = req.body.pw;
  delete req.body.pw;
  new User(req.body)
  .genPwHash(pw)
  .then(user => {
    return user.genToken();
  })
  .then(token => res.send(token))
  .catch(next);
});
