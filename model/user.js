'use strict';

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const createError = require('http-errors');
const debug = require('debug')('cfgram:user');

const userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  //findHash is a random string that will id a user used to create a token for the user
  findHash: {type: String},
});

userSchema.methods.generatePasswordHash = function(password) {
  debug('generatePasswordHash');
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if(err) return reject(createError(400, 'all fields required'));
      this.password = hash;
      resolve(this);
    });
  });
};

userSchema.methods.comparePasswordHash = function(password) {
  debug('comparePasswordHash');
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if(err) return reject(err); //500 cause i feel like it
      //user messed up again
      if(!valid) return reject(createError(401, 'passwords wrong fool'));
      resolve(this); //password came out right
    });
  });
};

userSchema.methods.generateFindHash = function(){
  debug('generateFindHash');
  return new Promise((resolve, reject) => {
    let tries = 3;
    let _generateFindHash = () => {
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save().then(() => resolve(this))
      .catch(err => {
        if(tries < 1)
          return reject(err);
        tries--;
        _generateFindHash();
      });
    };
    _generateFindHash();
  });
};

userSchema.methods.generateToken = function(){
  debug('generateToken');
  return this.generateFindHash()
  .then(user => {
    return jwt.sign({findHash: user.findHash}, process.env.APP_SECRET);
  });
};

//create and export model
module.exports = mongoose.model('user', userSchema);
