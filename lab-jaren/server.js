'use strict';

require('dotenv').load();

const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const debug = require('debug')('cfgram:server');

const app = express();

mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));
app.use(require('./lib/auth-router.js'));

app.use(function(err, req, res, next) {
  debug('error middleware');
  console.log(err.message);
  if(err.status)
    return res.status(err.status).send();
  if(err.name === 'ValidationError')
    return res.status(400).send();
  if(err.message === 'E11000 duplicate key')
    return res.status(409).send();
  res.status(500).send();
});

const server = app.listen(process.env.PORT, () => {
  debug('starting server');
  console.log('server up ::', process.env.PORT);
});

server.isRunning = true;
module.exports = server;
