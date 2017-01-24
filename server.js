'use strict';

require('dotenv').load();

const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const debug = require('debug')('gram:server');

const app = express();

mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI);

app.use(morgan('dev'));
app.use(cors);

app.use(require('./route/signup-route.js'));

app.use(function(err,req,res,next){
  debug('error middleware');
  if(err.status){
    return res.sendStatus(err.status);
  }

  if(err.name === 'ValidationError'){
    return res.sendStatus(400);
  }

  if(err.message === 'E11000 duplicate key'){
    return res.sendStatus(409);
  }

  res.sendStatus(500);
});

const server = app.listen(process.env.PORT, () => {
  console.log('Server is up! Party at port: ', process.env.PORT);
});

server.isOn = true;
module.exports = server;
