'use strict';

require('./mock-env.js');

const expect = require('chai').expect;
const superagent = require('superagent');

const User = require('../model/user.js');
const Gallery = require('../model/gallery.js');
const userMock = require('./lib/user-mock.js');
const galleryMock = require('./lib/gallery-mock.js');
const serverControl = require('./lib/server-control.js');

const baseURL = `http://localhost:${process.env.PORT}`;
const server = require('../server.js');

describe('testing auth-router', function() {
  before(serverControl.startSever);
  after(serverControl.killServer);
  afterEach((done) => {
    User.remove({})
    .then(() => done())
    .catch(done);
  });

  describe('testing POST /api/gallery', function(){
    before(userMock.bind(this));
    it('should respond with a gallery', (done) => {
      superagent.post(`${baseURL}/api/gallery`)
      .send({
        title: 'example gallery',
      })
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('example gallery');
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        done();
      })
      .catch(done);
    });
  });
});

describe('testing GET /api/gallery/:id', function() {
  beforeEach(userMock.bind(this));
  beforeEach(galleryMock.bind(this));
  it('should respond with a gallery', (done) => {
    let url = `${baseURL}/api/gallery/${this.tempGallery._id.toString()}`;
    superagent.get(url)
    .set('Authorization', `Bearer ${this.tempToken}`)
    .then(res => {
      expect(res.status).to.equal(200);
      expect(res.body.title).to.equal(this.tempGallery.title);
      expect(res.body.userID).to.equal(this.tempUser._id.toString());
      done();
    })
    .catch(done);
  });

  it('should respond with 401', (done) => {
    let url = `${baseURL}/api/gallery/${this.tempGallery._id.toString()}`;
    superagent.get(url)
    .set('Authorization', `Bearer badtoken`)
    .then(done)
    .catch(res => {
      expect(res.status).to.equal(401);
      done();
    })
    .catch(done);
  });

  it('should respond with 401', (done) => {
    let url = `${baseURL}/api/gallery/${this.tempGallery._id.toString()}`;
    superagent.get(url)
    .then(done)
    .catch(res => {
      expect(res.status).to.equal(401);
      done();
    })
    .catch(done);
  });

  it('should respond with a 404', (done) => {
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
