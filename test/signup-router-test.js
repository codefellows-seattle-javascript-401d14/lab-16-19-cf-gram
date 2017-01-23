'use strict';

require('./test-env.js');

const expect = require('chai').expect;
const superagent = require('superagent');
const User = require('../model/user.js');
const apiURL = `http://localhost:${process.env.PORT}`;
const server = require('../server.js');
