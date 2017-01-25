'use strict';

require('./mock-env.js');

const expect = require('chai').expect;
const superagent = require('superagent');

const User = require('../model/user.js');
const Midi = require('../model/midi.js');
const userMock = require('./lib/user-mocks.js');
const galleryMock = require('./lib/gallery-mock.js');
const serverControl = require('./lib/server-control.js');

const baseURL = `http://localhost:${process.env.PORT}`;
require('../server.js');

describe('testing midi-router', function() {
  before(serverControl.startServer);
  after(serverControl.killServer);
  afterEach(done => {
    User.remove({})
    .then(() => done())
    .catch(done);
  });

  describe('testing POST /api/midi', function() {
    beforeEach(userMock.bind(this));
    beforeEach(galleryMock.bind(this));
    it('should return a midi model', done => {
      superagent.post(`${baseURL}/api/midi`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .field('galleryID', this.tempGallery._id.toString())
      .field('title', 'gerudo')
      .attach('file', `${__dirname}/mock-assets/Gerudo Valley 1.mid`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('gerudo');
        expect(res.body.galleryID).to.equal(this.tempGallery._id.toString());
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(Boolean(res.body.photoURI)).to.equal(true);
        done();
      })
      .catch(done);
    });
  });
});
