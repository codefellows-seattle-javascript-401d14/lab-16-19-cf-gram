'use strict';

require('./mockEnv');
const expect = require('chai').expect;
const superagent = require('superagent');

const User = require('../model/User');
const Gallery = require('../model/Gallery');
const mockUser = require('./lib/mockUser');
const mockGallery = require('./lib/mockGallery');
const controlServ = require('./lib/controlServ');

const baseURL = `http://localhost:${process.env.PORT}`;

describe('testing gallery_router', function(){
  before(controlServ.startServ);
  after(controlServ.killServ);
  after((done) => {
    Promise.all([
      User.remove({}),
      Gallery.remove({}),
    ])
    .then(() => done())
    .catch(done);
  });
  describe('testing POST /api/gallery', function(){
    before(mockUser.bind(this));

    it('should respond with a gallery', (done) => {
      superagent.post(`${baseURL}/api/gallery`)
      .send({ title: 'testGallery' })
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('testGallery');
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        done();
      })
      .catch(done);
    });
  });

  describe('testing GET /api/gallery/:id', function(){
    beforeEach(mockUser.bind(this));
    beforeEach(mockGallery.bind(this));
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
});
