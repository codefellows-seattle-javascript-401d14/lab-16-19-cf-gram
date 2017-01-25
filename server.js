'use strict';

require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const debug = require('debug')('cf-gram:server');
const app = express();

mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));
app.use(require('./routes/auth_router.js'));
app.use(require('./routes/gallery_router.js'));

app.use(function(err, req, res, next){
  debug('error middleware');
  console.error(err.message);
  if(err.status) {
    return res.status(err.status).send();
  }
  if (err.name === 'ValidationError'){
    return res.status(400).send();
  }
  if (err.message.startsWith === 'E11000 duplicate key') {
    return res.status(409).send();
  }
  res.status(500).send();
  next();
});
const server = app.listen(process.env.PORT , ()=> {
  debug('server listening');
  console.log('server up ::', process.env.PORT);
});
server.isRunning = true;
module.exports = server;
