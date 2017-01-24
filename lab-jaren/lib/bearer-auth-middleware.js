'use strict';

const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const debug = require('debug')('cfgram:bearer-auth-middleware');

const User = require('../model/user.js');

module.exports = function(req, res, next) {
  debug('bearer auth middleware');
  let authorization = req.headers.authorization;
  if(!authorization)
    return next(createError(401, 'did not set authorization header'));

  let token = authorization.split('Bearer ')[1];
  // decrypt the token to get the findHash
  jwt.verify(token, process.env.APP_SECRET, function(err, decoded) {
    if(err) return next(createError(401, err.message));
    // find a user using the findHash
    User.findOne({findHash: decoded.findHash})
    .then(user => {
      // add the user to the req and call next
      req.user = user;
      next();
    })
    .catch(err => next(createError(401, err.message)));
  });
};
