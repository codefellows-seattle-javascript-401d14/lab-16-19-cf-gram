'use strict';

const createError = require('http-errors');
const debug = require('debug')('cfgram:basic-auth-middleware');

const User = require('../model/user.js');

module.exports = function(req, res, next) {
  debug('basic auth middleware');
  let authorization = req.headers.authorization;
  if(!authorization)
    return next(createError(401, 'did not send Authorization header'));
  if(!authorization.startsWith('Basic '))
    return next(createError(401, 'did not send Basic auth'));
  let basic = authorization.split('Basic ')[1];
  let usernameAndPassword = new Buffer(basic, 'base64').toString().split(':');
  let username = usernameAndPassword[0];
  let password = usernameAndPassword[1];

  User.findOne({username: username})
  .then(user => {
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
