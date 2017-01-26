'use strict';

require('./mock-env.js');

const expect = require('chai').expect;
const superagent = require('superagent');
const User = require('../model/user.js');
const userMocks = require('./lib/user-mock.js');
const serverControl = require('./lib/server-control.js');
const baseURL = `http://localhost:${process.env.PORT}`;
const server = require('../server.js');

describe('testing auth-router', function() {
  before(serverControl.startServer);
  after(serverControl.killServer);
  afterEach((done) => {
    User.remove({})
      .then(() => done())
      .catch(done);
  });

  describe('testing POST /api/signup', function() {
    it('should return a user', (done) => {
      superagent.post(`${baseURL}/api/signup`)
      .send({
        username: 'TheGrimHeep',
        email: 'thegrimheep@heep.com',
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

    it('should return a 400 if params are missing', (done) => {
      superagent.post(`${baseURL}/api/signup`)
      .send({
        username: '',
        email: '',
      })
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(400);
        done();
      })
      .catch(done);
    });

    describe('testing POST /api/signup for 409', function() {
      before(done => {
        superagent.post(`${baseURL}/api/signup`)
        .send({
          username: 'thisdoesntmatter',
          email: 'thegrimheep@heep.com',
          password: '1234',
        })
        .then(() => done())
        .catch(err => {
          console.error(err);
          done();
        });
      });

      it('should return a 409 if username is taken', (done) => {
        superagent.post(`${baseURL}/api/signup`)
        .send({
          username: 'thisdoesntmatter',
          email: 'thegrimheep@heep.com',
          password: '1234',
        })
        .then(done)
        .catch(err => {
          expect(err.status).to.equal(409);
          done();
        })
        .catch(done);
      });
    });

    describe('testing GET /api/login', function() {
      before(userMocks.bind(this));

      it('should respond with a token', (done) => {
        superagent.get(`${baseURL}/api/login`)
        .auth(this.tempUser.username, '1234')
        .then(res => {
          expect(res.status).to.equal(401);
          expect(Boolean(res.next)).to.equal(true);
          done();
        })
        .catch(done);
      });

      it('should return a 401 when not auth header is provided', (done) => {
        superagent.get(`${baseURL}/api/login`)
        .send({})
        .then(done)
        .catch(err => {
          expect(err.status).to.equal(401);
          done();
        });
      });
    });
  });
});
