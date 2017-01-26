'use strict';

const createError = require('http-errors');
const debug = require('debug')('cfgram:basic-auth-middleware');

const User = require('../model/user.js');

module.exports = function(req, res, next) {
  debug('basic auth middleware');
//fail with 401 if any part of middleware throws an error
//checking to make sure if there's authorization
  let Authorization = req.headers.authorization;
  if(!Authorization)
    return next(createError(401, 'did not send Authorization header'));
    //check to make sure it has Basic authorization
  if(!Authorization.startsWith('Basic'))
    return next(createError(401, 'did not send Basic auth'));
    //check to make sure it has a username and password
  let basic = Authorization.split('Basic')[1];
  let usernameAndPassword = new Buffer(basic, 'base64').toString().split(':');
  let username = usernameAndPassword[0];
  let password = usernameAndPassword[1];

//check the user exists
  User.findOne({username: username})
.then(user => {
  //makes sure password is sent
  return user.comparePasswordHash(password);
})
.then(user => {
  //store the user on the req object for use in the login route
  req.user = user;
  next();
})
  .catch(err => {
    //401 if fail
    next(createError(401, err.message));
  });
};
