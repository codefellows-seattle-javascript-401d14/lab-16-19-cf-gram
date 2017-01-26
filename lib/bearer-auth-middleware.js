'use strict';

const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const debug = require('debug')('beergram:bearer-auth-middleware');

const User = require('../model/user.js');
module.exports = function(req, res, next) {
  debug('basic auth middleware');
  let authorization = req.headers.authorization;
  if(!authorization)
    return next(createError(401, 'did not set authorization header'));
  let token = authorization.split('Bearer ')[1];
  jwt.verfy(token, process.env.APP_SECRET, function(err, decoded) {
    if(err) return next(createError(401, err.message));
    User.findOne({findHash: decoded.findHash})
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => next(createError(401, err.message)));
  });
};
