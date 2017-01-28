'use strict';

//verifies if user has rights to POST/GET requests from server

const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const debug = require('debug')('cfgram:bearer-auth-middleware');

const User = require('../model/user.js');

module.exports = function(req, res, next) {
  debug('bearer-auth-middleware');
  let authorization = req.headers.authorization;
  if(!authorization)
    return next(createError(401, 'did not set authorization header'));

  let token = authorization.split('Bearer ')[1];
  if(!token){
    return createError(401, 'no token provided');
  }
  // decrypt the token to get the findHash

  jwt.verify(token, process.env.APP_SECRET, function(err, decoded){
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
