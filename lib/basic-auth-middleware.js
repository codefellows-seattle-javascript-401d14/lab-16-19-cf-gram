'use strict';

const createError = require('http-errors');
const debug = require('debug')('exchange-o-gram: basic-auth-middleware');
const User = require('../model/user.js');

module.exports = function(req, res, next){
  debug('basic auth middleware');

  //fail with 401 if any of this is not correct
  //check to make sure it has an Auth header
  let authorization = req.headers.authorization;
  if(!authorization)
    return next(createError(401, 'did not send authorization header'));
  //check to make sure it has Basic auth
  if(!authorization.startsWith('Basic '))
    return next(createError(401, 'did not send Basic auth'));
  //check to make sure it has a usernamne and password
  let basic = authorization.split('Basic ')[1];
  let usernameAndPassword = new Buffer(basic, 'base64').toString().split(':');
  let username = usernameAndPassword[0];
  let password = usernameAndPassword[1];
  //check the user exists
  User.findOne({username: username})
  .then(user => {
    //make sure they sent the correct password
    return user.comparePasswordHash(password);
  })
  .then(user => {
    //store the user on the req object ofr use in the login route
    req.user = user;
    next();
  })
  .catch(err => {
    next(createError(401, err.message));
  });
};
