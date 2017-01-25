'use strict';

const debug = require('debug')('cf-gram:mockUser');
const User = require('../../model/User.js');

module.exports = function(done){
  debug('mockUser');
  new User({
    userName: 'test' + Math.floor(Math.random() * 100),
    email: 'test' + Math.floor(Math.random() * 100) + '@mockUser.com',
  })
  .genPwHash('superfancypassword')
  .then(user => user.save())
  .then(user => {
    this.tempUser = user;
    return user.genToken();
  })
  .then(token => {
    this.tempToken = token;
    done();
  })
  .catch(done);
};
