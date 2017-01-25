'use strict';

const debug = require('debug')('exchange-o-gram: mock-user');
const User = require('../../model/user.js');

module.exports = function(done){
  debug('mock user');
  new User({
    username: 'slug' + Math.random(),
    email: 'slug@slug.com' + Math.random(),
  })
  .generatePasswordHash('1234')
  .then(user => user.save())
  .then(user => {
    this.tempUser = user;
    return user.generateToken();
  })
  .then(token => {
    console.log(token, 'some other string so we know how to look for it');
    this.tempToken = token;
    done();
  })
  .catch(done);
};
