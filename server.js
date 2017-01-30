'use strict';

require('dotenv').load();

const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const debug = require('debug')('cfgram:server');
const PORT = process.env.PORT || 3000;

const app = express();

//mongoose.connect(process.env.MONGODB_URI);
mongoose.connect('mongodb://localhost/dev');
mongoose.Promise = require('bluebird');
app.use(cors());
app.use(morgan('dev'));

app.use(require('./route/auth-router.js'));
app.use(require('./route/sodacollection-router.js'));


app.use(function(err, req, res, next){

  console.log(err);
  if(err.status){
    res.status(err.status).send();
    return;
  }

  if (err.name === 'ValidationError'){

    res.status(400).send();
    return;
  }
  if(err.name === 'MongoError' && err.code === 11000) {
    return res.status(409).send();
  }
    // 409 means confit when a user is trying to do something that needs to
    // be unique and hass allready been taken
  res.status(500).send();
});

const server = app.listen(PORT, ()=> {
  debug(`server up: ${PORT}`);
});

server.isRunning = true; //used in testing to start and stop server
module.exports = server;
