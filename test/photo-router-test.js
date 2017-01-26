'use strict';

require('./mock-env.js');

const expect = require('chai').expect;
const superagent = require('superagent');

const User = require('../model/user.js');
const Photo = require('../model/photo.js');
const Gallery = require('../model/gallery.js');

const userMock = require('./lib/user-mocks.js');
const galleryMock = require('./lib/gallery-mock.js');
const serverControl = require('./lib/server-control.js');

const baseURL = `http://localhost:${process.env.PORT}`;


describe('testing photo-router', function(){
  before(serverControl.startServer);
  after(serverControl.killServer);

  afterEach((done) => {
    User.remove({})
    .then(() => done())
    .catch(done);
  });
});

describe('testing POST /api/photo', function(){
  beforeEach(userMock.bind(this));
  beforeEach(galleryMock.bind(this));
  it('should return a photo model', (done) => {
    superagent.post(`${baseURL}/api/photo`)
    .set('authorization', `Bearer ${this.tempToken}`)
    .field('galleryID', this.tempGallery._id.toString())
    .field('title', 'spinning')
    .attach('file', `${__dirname}/mock-assets/blarg.png`)
    .then(res => {
      expect(res.status).to.equal(200);
      expect(res.body.title).to.equal('spinning');
      expect(res.body.galleryID).to.equal(this.tempGallery.__id.toString());
      expect(res.body.userID).to.equal(this.tempUser.__id.toString());
      expect(Boolean(res.body.photoURI)).to.equal(true);
      done();
    })
    .catch(done);
  });
});
