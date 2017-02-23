'use strict';

require('./mock-env.js');
const expect = require('chai').expect;
const superagent = require('superagent');
const User = require('../model/user.js');
const userMocks = require('./lib/user-mocks.js');
const serverControl = require('./lib/server-control.js');
const baseURL = `http://localhost:${process.env.PORT}`;
require('../server.js');

describe('testing auth-router', function() {
  before(serverControl.startServer);
  after(serverControl.killServer);
  afterEach(done => {
    User.remove({})
    .then(() => done())
    .catch(done);
  });

  describe('testing POST /api/signup', function() {
    it('should respond with a user', done => {
      superagent.post(`${baseURL}/api/signup`)
      .send({
        username: 'slugbyte',
        email: 'slugbyte@slugbyte.com',
        password: '1234',
      })
      .then(res => {
        console.log('token:', res.text);
        expect(res.status).to.equal(200);
        expect(Boolean(res.text)).to.equal(true);
        done();
      })
      .catch(done);
    });

    it('a missing field should respond with 400 status', done => {
      superagent.post(`${baseURL}/api/signup`)
      .send({username: 'blah'})
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(400);
        done();
      })
      .catch(done);
    });

    it('bad endpoint should respond with 404 status', done => {
      superagent.post(`${baseURL}/api/sign`)
      .send({})
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(404);
        done();
      })
      .catch(done);
    });

    describe('POST username already taken', function() {
      before(done => {
        superagent.post(`${baseURL}/api/signup`)
        .send({
          username: 'blah',
          password: 'password',
          email: 'myemail@email.com',
        })
        .then(() => done())
        .catch(done);
      });
      it('should respond with 409 status', done => {
        superagent.post(`${baseURL}/api/signup`)
        .send({
          username: 'blah',
          password: 'admin',
          email: 'alsomyemail@email.com',
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

  describe('testing GET /api/login', function() {
    before(userMocks.bind(this));

    it('should respond with a token', done => {
      superagent.get(`${baseURL}/api/login`)
      .auth(this.tempUser.username, '1234')
      .then(res => {
        expect(res.status).to.equal(200);
        expect(Boolean(res.text)).to.equal(true);
        done();
      })
      .catch(done);
    });

    it('no auth header provided should respond with 401', done => {
      superagent.get(`${baseURL}/api/login`)
      .auth('notarealuser', '1234')
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      })
      .catch(done);
    });
  });
});
