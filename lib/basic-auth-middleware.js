'use strict';

const createError = require('http-errors');
const debug = require('debug')('cfgram:basic-auth-middleware');

const User = require('../model/user.js');

module.exports = function(req,res,next){
  debug('basic-auth-middleware');

  let authorization = req.headers.authorization;
  if(!authorization)
    return next(createError(401,'no authorization header given'));
  if(!authorization.startsWith('Basic '))
    return next(createError(401, 'need to send Basic auth'));

  let basicAuth = authorization.split('Basic ')[1];
  let usrnameAndPWD = new Buffer(basicAuth, 'base64').toString().split(':');
  let username = usrnameAndPWD[0];
  let password = usrnameAndPWD[1];

  User.findOne({username:username})
  .then( user => {
    return user.comparePasswordHash(password);
  })
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => {
    next(createError(401, err.message));
  });
};
