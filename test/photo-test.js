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

describe('testing photo POST router', function (){
  before(serverControl.startServer);
});
after(serverControl.turnoffServer);
after((done) => {
  User.remove({})
   .then(() => done())
   .catch(done);
});
//************************POST TEST********************************************

describe('testing POST /api/photo', function (){
  debug('debug photo POST test');
  beforeEach(userMocks.bind(this));
  beforeEach(SodaMock.bind(this));

  it.only('should should return a photo', (done)=>{
    superagent.post(`${baseURL}/api/photo`)
    .set('Authorization', `Bearer ${this.tempToken}`)
    .field('sodacollection', this.tempSoda._id.toString())
    .field('title','cokepicture')
    .attach('cokepicture', `${__dirname}/mock-assets/coke.png`)
    .then(res => {
      expect(res.status).to.equal(200);
      expect(res.body.title).to.equal('cokepicture');
      expect(res.body.sodacollectionID).to.equal(this.tempSoda._id.toString());
      expect(res.body.userID).to.equal(this.tempUser._id.toString());
      expect(Boolean(res.body.photoURI)).to.equal(true);
      done();
    })
     .catch(done);
  }); //end of it block

});
