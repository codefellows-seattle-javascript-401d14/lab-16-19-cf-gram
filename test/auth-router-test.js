'use strict';

require('./mock-env.js');
const expect = require('chai').expect;
const superagent = require('superagent');
const User = require('../model/user.js');
const baseURL = `http://localhost:${process.env.PORT}`;
const server = require('../server.js');
const serverControl = require('../lib/servercontrol.js');
const userMocks = require('../test/lib/mockUser.js');
const debug = require('debug')('cfgram:server');

describe('testing auth-router', function(){
  //start server if not running
  before(serverControl.startServer);
});

after(serverControl.turnoffServer);

after((done) => {
  User.remove({})
   .then(() => done())
   .catch(done);
});
//*********************POST TESTING**********************************************************
describe('testing POST /api/signup', function(){
  it('should return a user', function(done){
    superagent.post(`${baseURL}/api/signup`)
     .send({
       username: 'ken',
       email: 'ken@ken.com',
       password: '1234',
     })
     .then(res => {
       expect(res.status).to.equal(200);
       expect(Boolean(res.text)).to.equal(true);
       done();
     })
     .catch(done);
  });
  it('should return a 400 error', function(done){
    superagent.post(`${baseURL}/api/signup`)
     .send({
       username: 'ken',
       password: '1234',
     })
     .then(done)
     .catch(err => {
       expect(err.status).to.equal(400);
       done();
     })
    .catch(err => {
      done(err);
    });
  });
  it('should return a 409 error for duplicate user', function(done){
    superagent.post(`${baseURL}/api/signup`)
     .send({
       username: 'ken',
       email: 'ken@ken.com',
       password: '1234',
     })
     .then(done)
     .catch(err=> {
       expect(err.status).to.equal(409);
       done();
     })
     .catch(done);
  });
});

//***********************GET TESTING*****************************************
describe('testing GET /api/login', function(){
  before(userMocks.bind(this));

  it('should respond with a token', (done) => {
    debug('should repond with a token');
    superagent.get(`${baseURL}/api/login`)
    .auth(this.tempUser.username, '1234')
    .then(res => {
      expect(res.status).to.equal(200);
      expect(Boolean(res.text)).to.equal(true);
      done();
    })
      .catch(done);
  });
});
it('should respond with a 401 error', (done) => {
  debug('should repond with a 401 error');
  superagent.get(`${baseURL}/api/login`)
  .then(done)
  .catch(err=> {
    expect(err.status).to.equal(401);
    done();
  })
    .catch(done);
});

  
