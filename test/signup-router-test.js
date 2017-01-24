'use strict';

require('./test-env.js');

const expect = require('chai').expect;
const superagent = require('superagent');
const User = require('../model/user.js');
const apiURL = `http://localhost:${process.env.PORT}`;
const server = require('../server.js');

describe('Testing signup-router', function(){
  before((done) => {
    if(!server.isOn){
      server.listen(process.env.PORT, () => {
        server.isOn = true;
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    if(server.isOn){
      server.close(() => {
        server.isOn = false;
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

  describe('Testing POST /api/signup', function(){

    it('should return a user and status code 200 for success', (done) => {
      superagent.post(`${apiURL}/api/signup`)
      .send({
        username: 'fakeuser',
        email: 'fakeuser@fakeuser.com',
        password: 'booyah13',
      })
      .then(res => {
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


    it('should output a 409 status code if username is already exists', (done) => {
      before((done) => {
        superagent.post(`${apiURL}/api/signup`)
        .send({
          username:'jjicefish',
          email:'icecrazed3000@lit.com',
          password:'dacoldestevaFishy',
        }).save()
        .then (() => done())
        .catch(done);
      });
      superagent.post(`${apiURL}/api/signup`)
      .send({
        username:'jjicefish',
        email:'icecrazed3000@lit.com',
        password:'dacoldestevaFishy',
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
