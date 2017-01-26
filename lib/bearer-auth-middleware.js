'use strict';

const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const debug = require('debug')('cfgram:bearer-auth-middleware');

const User = require('../model/user.js');

module.exports = function(req, res, next) {
  //if any fail 401
  //parse the header to get token
  let authorization = req.headers.authorization;
  if(!authorization)
    return next(createError(401, 'did not set authorization header'));

  let token = authorization.split('Bearer ')[1];
  //decrypting the token for findHash
  jwt.verify(token, process.env.APP_SECRET, function(err, decoded){
    if(err) return next(createError(401, err.message));
    //find user using findHash
    User.findOne({findHash: decoded.findHash})
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => next(createError(401, err.message)));
  });
};
