'use strict';

const createError = require('http-errors');
const debug = require('debug')('cfgram:user');
const crypto = require('crypto');  //built it cryto maker in nodejs
const bcrypt = require('bcrypt');  //3rd party
const jwt = require('jsonwebtoken'); //gives access to json web tokens, transfering data verfication
const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  username: {type: String, require: true, unique:true},
  email: {type: String, require: true, unique: true},
  password: {type: String, require: true},
  //https://nodejs.org/api/crypto.html
  findHash: {type: String, unique: true},
});

//****************This generates  passwords**********************
playerSchema.methods.generatePasswordHash = function(password){
  return new Promise ((resolve, reject)=> {
    bcrypt.hash(password, 11, (err, hash) => {
      if(err) return reject(err); //this is a 500 error
      this.password = hash;
      resolve(this);
    });
  });
};
 //we now have a hashed password instead of a plain text password

//****************This compares passwords**********************
playerSchema.methods.comparePasswordHash = function(password){
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if(err) return reject(err); // 500 becuase bcrypt faild
      //it the users fault if the passwords dont match
      if(!valid) return reject(createError(401, 'passwords didnt match'));
      resolve(this); // passwords match!
    });
  });
};
//takes hash and asks "is this the same password"?
//************************This finds the Hash*****************************

playerSchema.methods.generateFindHash = function(){
  debug('generateFindHash');
  return new Promise((resolve, reject) => {
    let tries = 0;
    //going to generate a 32 bit token
    _generateFindHash.call(this);

    let _generateFindHash = () => {
      this.findHash = crypto.randomBytes(32).toString('hex'); //creates a custom token

      this.save().then(() => resolve(this.findHash))
      .catch(err => {
        if (tries > 3)   //if it errors more than 3 times then return an error
          return reject(err);
        tries++;
        _generateFindHash.call(this);
      });
    };
    _generateFindHash();
  });
};

//************************Generate token *******************************

playerSchema.methods.generateToken = function(){
  debug('generateToken');

  return new Promise ((resolve, reject) => {
    this.generateFindHash()
    .then(findHash => resolve (jwt.sign({token:findHash}, process.env.APP_SECRET)))
    .catch(err => reject(err));

    //create hash from above and gets passed into to sign method which is how we verifiy a specific user, and APP_SECRET is another layer of authentication

  });
};

// create and export model
module.exports = mongoose.model('player', playerSchema);
