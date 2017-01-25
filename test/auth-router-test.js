'use strict';

require('./test-env.js');
const expect = require('chai').expect;
const superagent = require('superagent');
const User = require('../model/user.js');
const userMock = require('./lib/user-mock.js');
const serverControl = require('./lib/server-control.js');
const apiURL = `http://localhost:${process.env.PORT}`;
// const server = require('../server.js');

describe('Testing signup-router', function(){
  before(serverControl.startServer);

  after(serverControl.killServer);

  afterEach((done) => {
    User.remove({})
    .then(() => done())
    .catch(done);
  });

  describe('Testing POST /api/signup', function(){
    it('should respond with a user', done => {
      superagent.post(`${apiURL}/api/signup`)
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

    it('should output a 400 status code for a bad request', (done) => {
      superagent.post(`${apiURL}/api/signup`)
      .send({
        username: 'fakeuser',
      })
      .then(done)
      .catch((err) => {
        expect(err.status).to.equal(400);
        done();
      })
      .catch(done);
    });

    describe('POST username already taken', function() {
      before(done => {
        superagent.post(`${apiURL}/api/signup`)
        .send({
          username: 'fake',
          password: 'booyah13',
          email: 'fake@email.com',
        })
        .then(() => done())
        .catch(done);
      });
      it('should respond with 409 status', done => {
        superagent.post(`${apiURL}/api/signup`)
        .send({
          username: 'fake',
          password: 'booyah13',
          email: 'fake@email.com',
        })
        .then(done)
        .catch(err => {
          console.log('asdasdasdsadasdsadasdsadasd');
          expect(err.status).to.equal(409);
          done();
        })
        .catch(done);
      });
    });

  });

  describe('Testing GET /api/login', function(){
    before(userMock.bind(this));
    it('should respond with a user token', (done) => {
      superagent.get(`${apiURL}/api/login`)
      .auth(this.tempUser.username, 'fakey454')
      .then( res => {
        expect(res.status).to.equal(200);
        expect(Boolean(res.text)).to.equal(true);
        done();
      })
      .catch(done);
    });
  });
  it('should respond with a 401 status code', (done) => {
    superagent.get(`${apiURL}/api/login`)
    .then(done)
    .catch(err => {
      expect(err.status).to.equal(401);
      done();
    })
    .catch(done);
  });
});
