'use strict';

require('./mock-env.js');
const expect = require('chai').expect;
const superagent = require('superagent');
const User = require('../model/user.js');
const baseURL = `http://localhost:${process.env.PORT}`;
const server = require('../server.js');

describe('testing auth-router', function() {
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
  after(done => {
    if(server.isRunning) {
      server.close(() => {
        server.isRunning = false;
        console.log('server down');
        done();
      });
      return;
    }
    done();
  });
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
  });
});
