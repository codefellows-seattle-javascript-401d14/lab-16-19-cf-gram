'use strict';

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
// const createError = require('http-errors');
const debug = require('debug')('gram:user');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type:String, require:true, unique:true},
  password: {type:String, required:true},
  email:{type:String, required:true, unique:true},
  findHash: {type:String, unique:true},
});

userSchema.methods.genPWDHash = function(password) {
  debug('makePWDHash');
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if(err) return reject(err);
      this.password = hash;
      resolve(this);
    });
  });
};

userSchema.methods.genFindHash = function(){
  debug('genFindHash');
  return new Promise((resolve, reject) => {
    let tries = 2;

    let _genFindHash = () => {
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save()
      .then(() => resolve(this))
      .catch( err => {
        if (tries < 1) return reject(err);
        tries--;
        _genFindHash();
      });
    };
    _genFindHash();
  });
};

userSchema.methods.genToken = function(){
  debug('genToken');
  return this.genFindHash()
  .then((user) => {
    return jwt.sign({findHash: user.findHash}, process.env.APP_SECRET);
  });
};

module.exports = mongoose.model('user', userSchema);
