'use strict';

const createError = require('http-errors');
const debug = require('debug')('beergram:basic-auth-middleware');

const User = require('..model/user.js');

module.exprts = function(req, res, next) {
  debug('basic auth middleware');
  let Authorization = req.headers.Authorization;
  if(!Authorization)
    return next(createError(401, 'did not send Authorization header'));
  if(!Authorization.startsWith('Basic '))
    return next(createError(401, 'did not send Basic auth'));
  let basic = Authorization.split('Basic ')[1];
  let usernameAndPassword = new Buffer(basic, 'base64').toString().split(':');
  let username = usernameAndPassword[0];
  let password = usernameAndPassword[1];

  User.findOne({
    username: username,
  })
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
