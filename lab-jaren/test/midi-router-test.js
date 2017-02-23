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

describe.only('testing midi-router', function() {
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

  describe('testing POST /api/gallery/:galleryID/midis', function() {
    beforeEach(userMock.bind(this));
    beforeEach(galleryMock.bind(this));
    it('should return a midi model', done => {
      superagent.post(`${baseURL}/api/gallery/${this.tempGallery._id.toString()}/midis`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .field('title', 'gerudo')
      .attach('file', `${__dirname}/mock-assets/Gerudo-Valley-1.mid`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('gerudo');
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(Boolean(res.body.awsKey)).to.equal(true);
        expect(Boolean(res.body.midiURI)).to.equal(true);
        done();
      })
      .catch(done);
    });

    it('no title provided should respond with 400 bad request', done => {
      superagent.post(`${baseURL}/api/gallery/${this.tempGallery._id.toString()}/midis`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .attach('file', `${__dirname}/mock-assets/Gerudo-Valley-1.mid`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(400);
        done();
      })
      .catch(done);
    });

    it('no file provided should respond with 400 bad request', done => {
      superagent.post(`${baseURL}/api/gallery/${this.tempGallery._id.toString()}/midis`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .field('title', 'gerudo')
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(400);
        done();
      })
      .catch(done);
    });

    it('invalid token should return 401 unauthorized', done => {
      superagent.post(`${baseURL}/api/gallery/${this.tempGallery._id.toString()}/midis`)
      .set('Authorization', 'Bearer badtoken')
      .field('title', 'gerudo')
      .attach('file', `${__dirname}/mock-assets/Gerudo-Valley-1.mid`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      })
      .catch(done);
    });

    it('invalid galleryID should return 404 not found', done => {
      superagent.post(`${baseURL}/api/gallery/badgalleryid/midis`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .field('title', 'gerudo')
      .attach('file', `${__dirname}/mock-assets/Gerudo-Valley-1.mid`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(404);
        done();
      })
      .catch(done);
    });

    it('not bearer auth should respond with 401', done => {
      superagent.post(`${baseURL}/api/gallery/${this.tempGallery._id.toString()}/midis`)
      .set('Authorization', `notbearer ${this.tempToken}`)
      .field('title', 'gerudo')
      .attach('file', `${__dirname}/mock-assets/Gerudo-Valley-1.mid`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      })
      .catch(done);
    });

    it('bad endpoint should respond with 404', done => {
      superagent.post(`${baseURL}/api/gallery/${this.tempGallery._id.toString()}/midastouch`)
      .set('Authorization', `notbearer ${this.tempToken}`)
      .field('title', 'gerudo')
      .attach('file', `${__dirname}/mock-assets/Gerudo-Valley-1.mid`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(404);
        done();
      })
      .catch(done);
    });
  });

  describe('testing DELETE /api/gallery/:galleryID/midis/:midiID', function() {
    beforeEach(userMock.bind(this));
    beforeEach(galleryMock.bind(this));
    beforeEach(midiMock.bind(this));
    it('should delete a midi', done => {
      superagent.delete(`${baseURL}/api/gallery/${this.tempGallery._id.toString()}/midis/${this.tempMidi._id.toString()}`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        expect(res.status).to.equal(204);
        done();
      })
      .catch(done);
    });
  });
});
