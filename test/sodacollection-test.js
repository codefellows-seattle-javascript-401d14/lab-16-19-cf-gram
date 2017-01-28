
'use strict';

require('./mock-env.js');
const expect = require('chai').expect;
const superagent = require('superagent');
const User = require('../model/user.js');
const baseURL = `http://localhost:${process.env.PORT}`;
const server = require('../server.js');
const serverControl = require('../lib/servercontrol.js');
const userMocks = require('../test/lib/mockUser.js');
const debug = require('debug')('cfgram:server');
const SodaMock = require('../test/lib/mocksoda.js');

describe('testing auth-router', function(){
  //start server if not running
  before(serverControl.startServer);
});

after(serverControl.turnoffServer);

after((done) => {
  User.remove({})
   .then(() => done())
   .catch(done);
});

//*************************POST TESTING**************************************

describe('testing POST /api/sodacollection', function(){
  debug('test sodacollection POST test');
  before(userMocks.bind(this));
  it('should return a sodacollection', (done) => {
    superagent.post(`${baseURL}/api/sodacollection`)
    .send({
      brand: 'Coke',
      diet: false,
      taste: 'decent',
      SodaId: this.tempUser._id.toString(),
    })
     .set('Authorization', `Bearer ${this.tempToken}`)
     .then(res => {
       expect(res.status).to.equal(200);
       expect(res.body.brand).to.equal('Coke');
       expect(res.body.SodaId).to.equal(this.tempUser._id.toString());
       expect(res.body.taste).to.equal('decent');
       expect(res.body.diet).to.equal(false);
       done();
     })
      .catch(done);
  });
  it('should return a 400 bad request error', (done) => {
    superagent.post(`${baseURL}/api/sodacollection`)
    .send({ })
    .set('Authorization', `Bearer ${this.tempToken}`)
     .then(done)
     .catch(err => {
       expect(err.status).to.equal(400);
       done();
     })
    .catch(err => {
      done(err);
    });
  }); //end of it block
  it('should return a 401 bad unauthorized/ no header error', (done) => {
    superagent.post(`${baseURL}/api/sodacollection`)
    .send({
      brand: 'Coke',
      diet: false,
      taste: 'decent',
      SodaId: this.tempUser._id.toString(),
    })
     .then(done)
     .catch(err => {
       expect(err.status).to.equal(401);
       done();
     })
    .catch(err => {
      done(err);
    });
  });
});
//*********************GET TESTING*********************************************
describe('testing GET Router', function(){
  describe('testing api/sodacollection/:id', function(){
    beforeEach(userMocks.bind(this));
    beforeEach(SodaMock.bind(this));

    it('should return a collection with valid id', (done) => {
      superagent.get(`${baseURL}/api/sodacollection/${this.tempUser._id}`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        expect(res.status).to.equal(200);
        done();
      })
       .catch(done);
    });//end of it block

  });
  it.only('should return a 404 error due to bad request', (done) => {
    superagent.get(`${baseURL}/api/sodacollection/123345`)
    .set('Authorization', `Bearer ${this.tempToken}`)
    .then(res => {
      expect(res.status).to.equal(404);
      done();
    })
     .catch(done);
  });//end of it block
});
