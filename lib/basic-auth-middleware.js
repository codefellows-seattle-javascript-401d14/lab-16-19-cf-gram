'use strict';

const debug = require('debug')('cfgram:auth-router-middleware');
const createError = require('http-errors');
const User = require('../model/user');


module.exports = function(req,res, next){
  debug ('basic auth middleware');

//does it have Auth header?
  let Authorization = req.headers.authorization;

  //authorization headers? --must have
  if(!Authorization)
    return next(createError(401, 'did not send Authorization header'));

  //basic auth -- must have
  if(!Authorization.startsWith('Basic '))
    return next(createError(401, 'did not send Basic Auth'));

//check to make sure it has username and password
  let base64 = Authorization.split('Basic ')[1];
  console.log(base64);
  let usernameAndPassword = new Buffer(base64, 'base64').toString().split(':');
  console.log(usernameAndPassword);
  let username = usernameAndPassword[0];
  console.log(username);
  let password = usernameAndPassword[1];
  console.log(password);

// check the user exists
  User.findOne({username: username})
.then(user => {
  // make sure they sent the correct password
  return user.comparePasswordHash(password);
})
.then(user => {
  // store the user on the req object for use in the login route
  req.user = user;
  next();
})
.catch(err => {
  // 401 if fail
  next(createError(401, err.message));
});
};
