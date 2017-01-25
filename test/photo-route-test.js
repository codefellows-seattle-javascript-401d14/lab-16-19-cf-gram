'use strict';
require('./test-env.js');
const expect = require('chai').expect;
const superagent = require('superagent');
const User = require('../model/user.js');
// const Album = require('../model/album.js');
const Photo = require('../model/photo.js');
const userMock = require('./lib/user-mock.js');
const albumMock = require('./lib/album-mock.js');
const serverControl = require('./lib/server-control.js');
const apiURL = `http://localhost:${process.env.PORT}`;

describe('Testing photo-router', function(){
  before(serverControl.startServer);

  after(serverControl.killServer);

  afterEach((done) => {
    User.remove({})
    .then(() => done())
    .catch(done);
  });

  describe.only('Testing POST /api/photo', function(){
    beforeEach(userMock.bind(this));
    beforeEach(albumMock.bind(this));

    it('should return a photo', (done) => {
      superagent.post(`${apiURL}/api/photo`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .field('albumID', this.tempAlbum._id.toString())
      .field('title', 'Crazy pic')
      .attach('file', `${__dirname}/test-assets/test.png`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('Crazy pic');
        expect(res.body.userID).to.equal(this.tempUSetempUser._id.toString());
        expect(res.body.albumID).to.equal(this.tempAlbum._id.toString());
        expect(Boolean(res.body.photoURI)).to.equal(true);
        done();
      })
      .catch(done);
    });
  });

});
