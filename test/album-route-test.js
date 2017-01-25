'use strict';
require('./test-env.js');
const expect = require('chai').expect;
const superagent = require('superagent');
const User = require('../model/user.js');
// const Album = require('../model/album.js');
const userMock = require('./lib/user-mock.js');
const albumMock = require('./lib/album-mock.js');
const serverControl = require('./lib/server-control.js');
const apiURL = `http://localhost:${process.env.PORT}`;
// const server = require('../server.js');

describe('Testing login-router', function(){
  before(serverControl.startServer);

  after(serverControl.killServer);

  afterEach((done) => {
    User.remove({})
    .then(() => done())
    .catch(done);
  });

  // afterEach((done) => {
  //   Album.remove({})
  //   .then(() => done())
  //   .catch(done);
  // });

  describe('testing POST /api/album', function(){
    before(userMock.bind(this));
    it('should respond with an album', (done) => {
      superagent.post(`${apiURL}/api/album`)
      .send({title: 'test album'})
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        console.log(this.tempToken);
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('test album');
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        done();
      })
      .catch(done);
    });
    it('should respond with a 400 status code', (done) => {
      superagent.post(`${apiURL}/api/album`)
      .send({})
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(400);
        done();
      })
      .catch(done);
    });
    it('should respond with a 401 status code', (done) => {
      superagent.post(`${apiURL}/api/album`)
      .send({title: 'test album'})
      .set('Authorization', `Bearer blahhhh`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      })
      .catch(done);
    });
  });

  describe('testing GET /api/album/:id', function(){
    before(userMock.bind(this));
    before(albumMock.bind(this));

    it('should respond with an album', (done) => {
      superagent.get(`${apiURL}/api/album/${this.tempAlbum._id.toString()}`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        console.log(this.tempAlbum._id);
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal(this.tempAlbum.title);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        done();
      })
      .catch(done);
    });
    it('test 401, when no authorization header is provided', (done) => {
      let url = `${apiURL}/api/album/${this.tempAlbum._id.toString()}`;
      superagent.get(url)
      .set('Authorization', `Bearer `)
      .then(done)
      .catch(res => {
        expect(res.status).to.equal(401);
        done();
      })
      .catch(done);
    });

    it('should respond with a 404', (done) => {
      let url = `${apiURL}/api/gallary/fakeID`;
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
  describe('testing DELETE /api/gallery/:id', function(){
    beforeEach(userMock.bind(this));
    beforeEach(albumMock.bind(this));

    it('should return 204', (done) => {
      let url = `${apiURL}/api/album/${this.tempAlbum._id.toString()}`;
      superagent.delete(url)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        expect(res.status).to.equal(204);
        done();
      })
      .catch(done);
    });

    it('DELETE test 401, when no authorization header is provided', (done) => {
      let url = `${apiURL}/api/album/${this.tempAlbum._id.toString()}`;
      superagent.delete(url)
      .set('Authorization', `Bearer `)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      })
      .catch(done);
    });

    it('should respond with a 404', (done) => {
      let url = `${apiURL}/api/gallery/fakeID`;
      superagent.delete(url)
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
