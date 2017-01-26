'use strict';

const debug = require('debug')('cfgram:mock-user');
const User = require('../../model/user.js');

module.exports = function(done){
  debug('mock-user');
  new User({
    username: 'notslugbyte' + Math.random(),
    email: 'notslugbyte@slugbyte.com' + Math.random(),
  })
  .generatePasswordHash('notslugbytespassword')
  .then(user => {
    return user.save();
  })
  .then(user => {
    this.tempUser = user;
    return user.generateToken();
  })
  .then(token => {
    this.tempToken = token;
    done();
  })
  .catch(err => {
    done(err);
  });
};
