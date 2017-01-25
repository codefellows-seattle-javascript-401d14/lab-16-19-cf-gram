'use strict';

//require mock env
require('./mock-env.js');
//npm modules
const expect = require('chai').expect;
const superagent = require('superagent');
//app modules
const User = require('../model/user.js');
const userMocks = require('./lib/user-mocks.js');
const serverControl = require('./lib/server-control.js');
//start server
const baseUrl = `http://localhost:${process.env.PORT}`;
const server = require('../server.js');
//mctesterson shredstone shreddy davis tester

describe('testing auth-router', function(){

  // start the server if its not running
  before(serverControl.startServer);

  // stop the server if its running
  after(serverControl.killServer);
  afterEach((done) => {
    User.remove({})
    .then(() => done())
    .catch(done);
  });

  describe('testing POST /api/signup', function(){
    it('should return a user', function(done){
      superagent.post(`${baseUrl}/api/signup `)
      .send({
        username: 'words and stufdf',
        email: 'jellobeansnot@carcolepsy.com',
        password: 'more words and stuff',
      })
      .then(res => {
        console.log('token: ', res.text);
        expect(res.status).to.equal(200);
        expect(Boolean(res.text)).to.equal(true);
        done();
      })
      .catch(done);
    });

    it('should return a 400 if missing field', function(done){
      superagent.post(`${baseUrl}/api/signup `)
      .send({username: ' ', password: ' '})
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(400);
        done();
      })
      .catch(done);
    });

    describe('testing POST /api/signup for 409', function(){
      before(done => {
        superagent.post(`${baseUrl}/api/signup `)
        .send({username: '(⌐■_■)–︻╦╤─ – – –', email: 'epiphenot@carcolepsy.com', password: '(♥_♥)'})
        .then(() => done())
        .catch(err => {
          console.error(err);
          done();
        });
      });
      it('should return a 409 if username taken', function(done){
        superagent.post(`${baseUrl}/api/signup `)
        .send({username: '(⌐■_■)–︻╦╤─ – – –', email: 'epiphenot@carcolepsy.com', password: '(♥_♥)'})
        .then(done)
        .catch(err => {
          console.log(err, 'whats going on here?');
          expect(err.status).to.equal(409);
          done();
        })
        .catch(done);
      });
    });
    describe('testing GET /api/login', function(){
      before(userMocks.bind(this));

      it('should respond with a token', (done) => {
        superagent.get(`${baseUrl}/api/login`)
        .auth(this.tempUser.username, '1234')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(Boolean(res.text)).to.equal(true);
          done();
        })
        .catch(done);
      });
      it('should return a 401, when no authorization header is provided', function(done){
        superagent.get(`${baseUrl}/api/login `)
      .send({ })
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      })
      .catch(done);
      });
    });
  });
});
