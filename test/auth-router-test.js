'use strict';

//require mock env
require('./mock-env.js');
//npm modules
const expect = require('chai').expect;
const superagent = require('superagent');
//app modules
const User = require('../model/user.js');
const userMock = require('./lib/user-mocks.js');
const serverControl = require('./lib/server-control.js');
//start server
const baseURL = `http://localhost:${process.env.PORT}`;
const server = require('../server.js');
//testing dot dot dot

describe('testing auth-router', function() {
  //starts server if it's not running
  before(serverControl.startServer);

  //stops the server if it's going on a rampage
  after(serverControl.killServer);
  afterEach((done) => {
    User.remove({})
    .then(() => done())
    .catch(done);
  });


  describe('testing POST /api/signup', function(){
    it('should return a user', function(done){
      superagent.post(`${baseURL}/api/signup`)
      .send({
        username: 'notslugbyte',
        email: 'notslugbyte@slugbyte.com',
        password: 'notslugbytespassword',
      })
      .then(res => {
        console.log('token: ', res.text);
        expect(res.status).to.equal(200);
        expect(Boolean(res.text)).to.equal(true);
        done();
      })
      .catch(done);
    });
    it('should return a 400 status due to no body being provided in the body', function(done){
      superagent.post(`${baseURL}/api/signup`)
      .send({
        username:'',
        email: '',
        password: '',
      })
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(400);
        done();
      });
    });
  });
  describe('testing POST /api/signup', function() {
    before(done => {
      superagent.post(`${baseURL}/api/signup`)
      .send({
        username: 'notslugbyte',
        email: 'notslugbyte@slugbyte.com',
        password: 'notslugbytespassword',
      })
      .then(() => done())
      .catch(done);
    });
    it('should return a beach boy 409', function(done) {

      superagent.post(`${baseURL}/api/signup`)
      .send({
        username: 'notslugbyte',
        email: 'notslugbyte@slugbyte.com',
        password: 'notslugbytespassword',
      })
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(409);
        done();
      })
      .catch(done);
    });
  });

  describe('testing GET /api/login', function(){
    before(userMock.bind(this));

    it('should respond with a token', (done) => {
      superagent.get(`${baseURL}/api/login`)
      .auth(this.tempUser.username, 'notslugbytespassword')
      .then(res => {
        expect(res.status).to.equal(200);
        expect(Boolean(res.text)).to.equal(true);
        done();
      })
      .catch(done);
    });
  });
  it('should return a 401, when no authorization is provided', function(done){
    superagent.get(`${baseURL}/api/login`)
  .send({ })
  .then(done)
  .catch(err => {
    expect(err.status).to.equal(401);
    done();
  })
  .catch(done);
  });

});
