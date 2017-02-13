'use strict';

require('./mock-env.js');

const expect = require('chai').expect;
const superagent = require('superagent');

const User = require('../model/user.js');
const Midi = require('../model/midi.js');
const Gallery = require('../model/gallery.js');
const userMock = require('./lib/user-mocks.js');
const galleryMock = require('./lib/gallery-mock.js');
const midiMock = require('./lib/midi-mock.js');
const serverControl = require('./lib/server-control.js');

const baseURL = `http://localhost:${process.env.PORT}`;
require('../server.js');

describe('testing midi-router', function() {
  before(serverControl.startServer);
  after(serverControl.killServer);
  afterEach(done => {
    Promise.all([
      User.remove({}),
      Gallery.remove({}),
      Midi.remove({}),
    ])
    .then(() => done())
    .catch(done);
  });

  describe('testing POST /api/midis', function() {
    beforeEach(userMock.bind(this));
    beforeEach(galleryMock.bind(this));
    it('should return a midi model', done => {
      superagent.post(`${baseURL}/api/midis`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .field('galleryID', this.tempGallery._id.toString())
      .field('title', 'gerudo')
      .attach('file', `${__dirname}/mock-assets/Gerudo-Valley-1.mid`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('gerudo');
        expect(res.body.galleryID).to.equal(this.tempGallery._id.toString());
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(Boolean(res.body.midiURI)).to.equal(true);
        done();
      })
      .catch(done);
    });
  });

  describe('testing DELETE /api/midis/:id', function() {
    beforeEach(userMock.bind(this));
    beforeEach(galleryMock.bind(this));
    beforeEach(midiMock.bind(this));
    it('should delete a midi', done => {
      superagent.delete(`${baseURL}/api/midis/${this.tempMidi._id.toString()}`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        expect(res.status).to.equal(204);
        done();
      })
      .catch(done);
    });
  });
});
