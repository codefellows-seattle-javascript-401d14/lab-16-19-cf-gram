'use strict';

require('./mock-env.js');
const expect = require('chai').expect;
const superagent = require('superagent');

const User = require('../model/user.js');
const Midi = require('../model/midi.js');
const Gallery = require('../model/gallery.js');
const userMocks = require('./lib/user-mocks.js');
const galleryMock = require('./lib/gallery-mock.js');
const midiMock = require('./lib/midi-mock.js');
const serverControl = require('./lib/server-control.js');

const baseURL = `http://localhost:${process.env.PORT}`;
require('../server.js');

describe('testing gallery router', function() {
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

  describe('testing POST /api/gallery', function() {
    before(userMocks.bind(this));

    it('should respond with a gallery', done => {
      superagent.post(`${baseURL}/api/gallery`)
      .send({
        title: 'example gallery',
        description: 'example description',
      })
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('example gallery');
        expect(res.body.description).to.equal('example description');
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        done();
      })
      .catch(done);
    });

    it('should respond with 400', done => {
      superagent.post(`${baseURL}/api/gallery`)
      .send({title: ''})
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(400);
        done();
      })
      .catch(done);
    });

    it('should respond with 401', done => {
      superagent.post(`${baseURL}/api/gallery`)
      .send({title: 'SPAMSPAMSPAM'})
      .set('Authorization', `Bearer badtoken`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      })
      .catch(done);
    });
  });

  describe('testing GET /api/gallery/:id', function() {
    // first mock a user
    beforeEach(userMocks.bind(this));
    // then mock the gallery
    beforeEach(galleryMock.bind(this)); // won't work without user being mocked first
    beforeEach(midiMock.bind(this));
    it('should respond with a gallery', done => {
      let url = `${baseURL}/api/gallery/${this.tempGallery._id.toString()}`;
      superagent.get(url)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal(this.tempGallery.title);
        expect(res.body.description).to.equal(this.tempGallery.description);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(res.body.midis[0]._id).to.equal(this.tempMidi._id.toString());
        done();
      })
      .catch(done);
    });

    it('should respond with a 401', done => {
      let url = `${baseURL}/api/gallery/${this.tempGallery._id.toString()}`;
      superagent.get(url)
      .set('Authorization', 'Bearer badtoken')
      .then(done)
      .catch(res => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('should respond with a 404', done => {
      let url = `${baseURL}/api/gallery/fakeID`;
      superagent.get(url)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(done)
      .catch(res => {
        expect(res.status).to.equal(404);
        done();
      })
      .catch(done);
    });
  });

  describe('testing GET /api/gallery', function() {
    beforeEach(userMocks.bind(this));
    beforeEach(galleryMock.bind(this));

    it('should respond with an array of galleries', done => {
      superagent.get(`${baseURL}/api/gallery`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.instanceof(Array);
        done();
      })
      .catch(done);
    });

    it('bad endpoint should respond with 404', done => {
      superagent.get(`${baseURL}/api/galleries`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(404);
        done();
      })
      .catch(done);
    });
  });

  describe('testing DELETE /api/gallery/:id', function() {
    beforeEach(userMocks.bind(this));
    beforeEach(galleryMock.bind(this));

    it('should remove the gallery and respond with 204', done => {
      superagent.delete(`${baseURL}/api/gallery/${this.tempGallery._id.toString()}`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        expect(res.status).to.equal(204);
        done();
      })
      .catch(done);
    });

    it('should respond with a 401', done => {
      superagent.delete(`${baseURL}/api/gallery/${this.tempGallery._id.toString()}`)
      .set('Authorization', `Bearer badtoken`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      })
      .catch(done);
    });

    it('should respond with a 404', done => {
      superagent.delete(`${baseURL}/api/gallery/fakeID`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(404);
        done();
      })
      .catch(done);
    });
  });

  describe('testing PUT /api/gallery/:id', function() {
    beforeEach(userMocks.bind(this));
    beforeEach(galleryMock.bind(this));

    it('should respond with an updated gallery', done => {
      superagent.put(`${baseURL}/api/gallery/${this.tempGallery._id.toString()}`)
      .send({title: 'FTW', description: 'game soundtracks'})
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('FTW');
        expect(res.body.description).to.equal('game soundtracks');
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        done();
      })
      .catch(done);
    });

    it('should respond with a 400 bad request', done => {
      superagent.put(`${baseURL}/api/gallery/${this.tempGallery._id.toString()}`)
      .send('update, this will not hrr-hrr-hrr')
      .set('Authorization', `Bearer ${this.tempToken}`)
      .set('Content-Type', 'application/json')
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(400);
        done();
      })
      .catch(done);
    });

    it('should respond with 401 unauthorized', done => {
      superagent.put(`${baseURL}/api/gallery/${this.tempGallery._id.toString()}`)
      .send({title: 'umm', description: 'canihazupdate?'})
      .set('Authorization', 'Bearer mytoekin')
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      })
      .catch(done);
    });

    it('should respond with 404 not found', done => {
      superagent.put(`${baseURL}/api/gallery/hacktheplanet`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(404);
        done();
      })
      .catch(done);
    });
  });
});
