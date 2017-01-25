'use strict';

require('./mock-env.js');
const expect = require('chai').expect;
const superagent = require('superagent');
const User = require('../model/user.js');
const baseURL = `http://localhost:${process.env.PORT}`;
const server = require('../server.js');

describe('testing auth-router', function(){
  //start server if not running
  before(done => {
    if(!server.isRunning){
      server.listen(process.env.PORT, () => {
        server.isRunning = true;
        console.log('server up');
        done();
      });
      return;
    }
    done();
  });
});

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

after((done) => {
  User.remove({})
   .then(() => done())
   .catch(done);
});

describe('testing POST /api/signup', function(){
  it('should return a user', function(done){
    superagent.post(`${baseURL}/api/signup`)
     .send({
       username: 'ken',
       email: 'ken@ken.com',
       password: '1234',
     })
     .then(res => {
       console.log('token: ',res.text);
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
