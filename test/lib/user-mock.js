'use strict';

const User = require('../../model/user.js');
const debug = require('debug')('cfgram:user-mock');

module.exports = function(done){
  debug('user-mock');
  new User({
    username: 'fake' + Math.random(),
    email: 'fakep@email.com' + Math.random(),
  })
  .generatePasswordHash('fakey454')
  .then(user => user.save())
  .then(user => {
    this.tempUser = user;
    return user.generateToken();
  })
  .then(token => {
    this.tempToken = token;
    done();
  })
  .catch(done);
};
