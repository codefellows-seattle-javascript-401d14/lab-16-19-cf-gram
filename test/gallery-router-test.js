'use strict';

//require mock env
require('./mock-env.js');
//npm modules
const expect = require('chai').expect;
const superagent = require('superagent');
// app modules
const User = require('../model/user.js');
const Gallery = require('../model/gallery.js');
const userMock = require('./lib/user-mocks.js');
const galleryMock = require('./lib/gallery-mock.js');
const serverControl = require('./lib/server-control.js');
// start server
const baseURL = `http://localhost:${process.env.PORT}`;
const server = require('../server.js');
//shreddy mcshredserstone the test game

describe('testing auth-router', function(){
  //start the server if its not running
  before(serverControl.startServer);

  //stop the server if its running
  after(serverControl.killServer);
  afterEach((done) => {
    User.remove({})
    .then(() => done())
    .catch(done);
  });

  describe('testing POST /api/gallery', function(){
    beforeEach(userMock.bind(this));

    it('should respond with a gallery', (done) => {
      console.log(this.tempToken);
      superagent.post(`${baseURL}/api/gallery`)
      .send({ title: 'example gallery' })
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('example gallery');
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        done();
      })
      .catch(done);
    });
    it('test 401, when no authorization header is provided', (done) => {
      superagent.post(`${baseURL}/api/gallery `)
      .send({title: 'example gallery'})
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      })
      .catch(done);
    });
    it('should return a 400 if missing field', (done) => {
      console.log(this.tempToken);
      superagent.post(`${baseURL}/api/gallery `)
      .send('{')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(400);
        done();
      })
      .catch(done);
    });
  });

  describe('testing GET /api/gallery/:id', function(){
    // first mock a user
    beforeEach(userMock.bind(this));
    // then mock the gallery
    beforeEach(galleryMock.bind(this)); // wont work without user being mocked first

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

    it('test 401, when no authorization header is provided', (done) => {
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
  //latest
  describe('testing DELETE /api/gallery/:id', function(){
    // first mock a user
    beforeEach(userMock.bind(this));
    // then mock the gallery
    beforeEach(galleryMock.bind(this)); // wont work without user being mocked first

    it('should return 204', (done) => {
      let url = `${baseURL}/api/gallery/${this.tempGallery._id.toString()}`;
      superagent.delete(url)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        expect(res.status).to.equal(204);
        done();
      })
      .catch(done);
    });

    it('DELETE test 401, when no authorization header is provided', (done) => {
      let url = `${baseURL}/api/gallery/${this.tempGallery._id.toString()}`;
      superagent.delete(url)
      .set('Authorization', `Bearer badtoken`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      })
      .catch(done);
    });

    // it('DELETE test 401, when no authorization header is provided', (done) => {
    //   let url = `${baseURL}/api/gallery/${this.tempGallery._id.toString()}`;
    //   superagent.delete(url)
    //   .then(done)
    //   .catch(res => {
    //     expect(res.status).to.equal(401);
    //     done();
    //   })
    //   .catch(done);
    // });

    it('should respond with a 404', (done) => {
      let url = `${baseURL}/api/gallery/fakeID`;
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
