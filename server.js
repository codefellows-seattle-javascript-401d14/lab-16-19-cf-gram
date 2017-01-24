'use strict';

require('dotenv').load();

const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const debug = require('debug')('cfgram:server');
const PORT = process.env.PORT || 3000;

const app = express();

mongoose.connect(process.env.MONGODB_URI);
// mongoose.Promise = require('bluebird');

app.use(cors());
app.use(morgan('dev'));

const server = app.listen(PORT, ()=> {
  debug(`server up: ${PORT}`);
});

server.isRunning = true;
module.exports = server;
