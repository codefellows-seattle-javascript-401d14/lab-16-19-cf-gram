'use strict';

require('./mockEnv');
const expect = require('chai').expect;
const superagent = require('superagent');

const User = require('../model/User');
const Photo = require('../model/Photo');
const Gallery = require('../model/Gallery');
const mockUser = require('./lib/mockUser');
const mockGallery = require('./lib/mockGallery');
const controlServ = require('./lib/controlServ');

const baseURL = `http://localhost:${process.env.PORT}`;

describe('testing photo_router', function() {
  before(controlServ.startServ);
  after(controlServ.killServ);
  afterEach((done) => {
    Promise.all([
      User.remove({}),
      Gallery.remove({}),
    ])
    .then(() => done())
    .catch(done);
  });
  describe('testing POST /api/photo', function(){
    beforeEach(mockUser.bind(this));
    beforeEach(mockGallery.bind(this));

    it('should return an photo model', (done) => {
      superagent.post(`${baseURL}/api/photo`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .field('title', 'Bernie_wwf')
      .field('galleryID', this.tempGallery._id.toString())
      .attach('file', `${__dirname}/../test/assets/images/Bernie_inaug_steel-chair.jpg`)
      .then(res => {
        console.log('**************************');
        console.log(res.body);
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('Bernie_wwf');
        expect(res.body.galleryID).to.equal(this.tempGallery._id.toString());
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(Boolean(res.body.photoURI)).to.equal(true);
        done();
      })
      .catch(done);
    });
  });
});
