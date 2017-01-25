'use strict';

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const createError = require('http-errors');
const debug = require('debug')('exchange-o-gram: user');

//create the schema
const userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  //findHash is a random string that will id a user used to create a token for said user
  findHash: {type: String, unique: true},
});

userSchema.methods.generatePasswordHash = function(password){
  debug('generatePasswordHash');
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 11, (err, hash) => {
      if(err) return reject(createError(401, 'passwords didnt match ☚ (<‿<)☚'));
      this.password = hash;
      resolve(this);
    });
  });
};

userSchema.methods.comparePasswordHash = function(password){
  debug('comparePasswordHash');
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if(err) return reject(err); // 500 becuase bcrypt faild
      //it the users fault if the passwords dont match
      if(!valid) return reject(createError(401, 'passwords didnt match ☚ (<‿<)☚'));
      resolve(this); // passwords match!
    });
  });
};

userSchema.methods.generateFindHash = function(){
  debug('generateFindHash');
  return new Promise((resolve, reject) => {
    let tries = 3;

    let _gennerateFindHash = () => {
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save().then(() => resolve(this))
      .catch(err => {
        if (tries < 1)
          return reject(err);
        tries--;
        _gennerateFindHash();
      });
      debug('hellomotogeneratefindhashbrowns');
    };

    _gennerateFindHash();
  });
};

userSchema.methods.generateToken = function(){
  debug('generateToken');
  return this.generateFindHash()
  .then(user => {
    return jwt.sign({findHash: user.findHash}, process.env.APP_SECRET);
  });
};

// create and export model
module.exports = mongoose.model('user', userSchema);
