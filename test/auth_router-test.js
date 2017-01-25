'use strict';

require('./mockEnv');
const expect = require('chai').expect;
const superagent = require('superagent');

const User = require('../model/User');
const mockUser = require('./lib/mockUser');
const controlServ = require('./lib/controlServ');

const baseURL = `http://localhost:${process.env.PORT}`;
const server = require('../server');

describe('testing auth_router', function() {
  before(controlServ.startServ);
  after(controlServ.killServ);
  afterEach((done) => {
    User.remove({})
    .then(() => done())
    .catch(done);
  });
  describe('testing POST /api/signup', function(){
    it('should return a user', function(done){
      superagent.post(`${baseURL}/api/signup`)
      .send({
        userName: 'gnoevil',
        email: 'geno.guerrero@gmail.com',
        pw: 'superfancypassword',
      })
      .then(res => {
        // console.log('token: ', res.text);
        expect(res.status).to.equal(200);
        expect(Boolean(res.text)).to.equal(true);
        done();
      })
      .catch(done);
    });
    it('should return a 400 error', function(done) {
      superagent.post(`${baseURL}/api/signup`)
      .send({ })
      .then(done)
      .catch(res => {
        expect(res.status).to.equal(400);
        done();
      })
     .catch(done);
    });
  });
});
