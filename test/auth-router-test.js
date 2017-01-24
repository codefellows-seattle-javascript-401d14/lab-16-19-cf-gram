'use strict';

//require mock env
require('./mock-env.js');
//npm modules
const expect = require('chai').expect;
const superagent = require('superagent');
//app modules
const User = require('../model/user.js');
//start server
const baseURL = `http://localhost:${process.env.PORT}`;
const server = require('../server.js');
//testing dot dot dot

describe('testing auth-router', function() {
  //starts server if it's not running
  before(done => {
    if(!server.isRunning) {
      server.listen(process.env.PORT, () => {
        server.isRunning = true;
        console.log('server up');
        done();
      });
      return;
    }
    done();
  });

  //stops the server if it's going on a rampage
  after(done => {
    if(server.isRunning){
      server.close(() => {
        server.isRunning = false;
        console.log('server down');
        done();
      });
      return;
    }
    done();
  });

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
});
