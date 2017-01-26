'use stirct';

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const createError = require('http-errors');
const debug = require('debug')('cf-gram:UserModel');

const UserSchema = mongoose.Schema({
  userName: {type: String, required: true, unique: true, trim: true},
  email: {type: String, required: true, unique: true, trim: true},
  pw: {type: String, required: true},
  findHash: {type: String, unique: true},
});

UserSchema.methods.genPwHash = function(pw){
  debug('genPwHash');
  return new Promise((resolve, reject) => {
    bcrypt.hash(pw, 11, (err, hash) => {
      if(err) return reject(createError(400, 'no password supplied'));
      this.pw = hash;
      resolve(this);
    });
  });
};

UserSchema.methods.comparePwHash = function(pw){
  debug('comparePwHash');
  return new Promise((resolve, reject) => {
    bcrypt.compare(pw, this.pw, (err, valid) => {
      if(err) return reject(createError(400, 'no password supplied'));
      if(!valid) return reject(createError(401, 'passwords didn\'t match'));
      resolve(this);
    });
  });
};

UserSchema.methods.genFindHash = function() {
  debug('genFindHash');
  return new Promise((resolve, reject) => {
    let tries = 3;
    let _genFindHash = () => {
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save()
      .then(() => resolve(this))
      .catch(err => {
        if (tries < 1)
          return reject(err);
        tries--;
        _genFindHash();
      });
    };
    _genFindHash();
  });
};

UserSchema.methods.genToken = function(){
  debug('genToken');
  return this.genFindHash()
  .then(user => {
    return jwt.sign({findHash: user.findHash}, process.env.APP_SECRET);
  });
};

module.exports = mongoose.model('user', UserSchema);
