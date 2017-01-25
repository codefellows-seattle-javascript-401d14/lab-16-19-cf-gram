'use strict';

//load .env
require('dotenv').load();
//node modules
//npm modules
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const debug = require('debug')('cfgram:server');

//app module
//module constants
const app = express();
//setup db
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI);
//app middlware
app.use(cors());
app.use(morgan('dev'));
//app routes
app.use(require('./route/auth-router.js'));
app.use(require('./route/gallery-router.js'));
//app error middleware
app.use(function(err, req, res, next){
  console.log(err.message);
  if(err.status){
    res.status(err.status).send();
    return;
  }
  if(err.name === 'ValidationError') {
    res.status(400).send();
    return;
  }
  if(err.name === 'MongoError' && err.code == '11000') {
  // 409 means confit when a user is trying to do something that needs to
  // be unique and has already been taken
    res.status(409).send(); //beach boys: she's real fine my 409.
    return;
  }

  res.status(500).send();
});

const server = app.listen(process.env.PORT, () => {
  console.log('server up ::', process.env.PORT);
});

server.isRunning = true;
module.exports = server;
