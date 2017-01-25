'use strict';

const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const debug = require('debug')('cf-gram:bearer_auth');

const User = require('../model/User');

module.exports = function(req, res, next){
  debug('bearer_auth');
  let Auth = req.headers.authorization;
  if(!Auth)
    return next(createError(401, 'did not set Authorization header'));

  let token = Auth.split('Bearer ')[1];
  jwt.verify(token, process.env.APP_SECRET, function(err, decoded){
    if(err) return next(createError(401, err.message));
    User.findOne({findHash: decoded.findHash})
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => next(createError(401, err.message)));
  });
};
