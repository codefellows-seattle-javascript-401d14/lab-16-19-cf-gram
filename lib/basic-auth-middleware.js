'use strict';

const debug = require('debug')('cfgram:auth-router-middleware');
const createError = require('http-errors');
module.exports = function(req,res, next){
  debug ('basic auth middleware');
};

//does it have Auth header?
let Authorization = req.headers.Authorization
//authorization headers? --must have
if(!Authorization)
  return next(createError(401, 'did not send Authorization header'));
//basic auth -- must have
if(!Authorization.startsWith('Basic '))
  return next(createError(401, 'did not send Basic Auth'));

//check to make sure it has username and password
let base64 = Authorization.split('Basic ')[1];
