'use strict';

const createError = require('http-errors');
const debug = require('debug')('cfgram:basic-auth-middleware');

const User = require('../model/User.js');

module.exports = function(req, res, next){
  debug('basic_auth');
  let Auth = req.headers.authorization;

  if(!Auth)
    return next(createError(401, 'did not send Authorization header'));

  if(!Auth.startsWith('Basic '))
    return next(createError(401, 'did not send Basic auth'));

  let basic = Auth.split('Basic ')[1];
  let uNameAndPw = new Buffer(basic, 'base64').toString().split(':');
  let userName = uNameAndPw[0];
  let pw = uNameAndPw[1];

  User.findOne({userName: userName})
  .then(user => {
    return user.comparePwHash(pw);
  })
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => {
    next(createError(401, err.message));
  });
};
