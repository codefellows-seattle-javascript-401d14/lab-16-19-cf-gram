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
        console.log('server lit');
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
        console.log('server off');
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
  });
});
