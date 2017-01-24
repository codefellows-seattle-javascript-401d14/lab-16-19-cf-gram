'use strict';

const debug = require('debug')('cfgram:user-mocks');
const User = require('../../model/user.js');

module.exports = function(done) {
  debug('mock user');
  new User({
    username: 'pinkbunnyslippers87' + Math.random(),
    email: 'hilyfe@email.com' + Math.random(),
  })
  .generatePasswordHash('1234')
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
