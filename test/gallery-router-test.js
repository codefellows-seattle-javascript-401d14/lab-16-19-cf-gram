'use strict';

//require mock env
require('./mock-env.js');
//npm modules
const expect = require('chai').expect;
const superagent = require('superagent');
//app modules
const User = require('../model/user.js');
const Gallery = require('../model/gallery.js');
const userMock = require('./lib/user-mocks.js');
const galleryMock = require('./lib/gallery-mock.js');
const serverControl = require('./lib/server-control.js');
//start server
const baseURL = `http://localhost:${process.env.PORT}`;
const server = require('../server.js');
//testing dot dot dot

describe('testing gallery-router', function(){
  //start server if it's not running
  before(serverControl.startServer);

  //kill server if it's running
  after(serverControl.killServer);
  afterEach((done) => {
    User.remove({})
    .then(() => done())
    .catch(done);
  });


  describe('testing POST /api/gallery', function() {
    before(userMock.bind(this));

    it('should respond with a gallery', (done) => {
      superagent.post(`${baseURL}/api/gallery`)
    .send({title: 'weeeewoooo'})
    .set('Authorization', `Bearer ${this.tempToken}`)
    .then(res => {
      expect(res.status).to.equal(200);
      expect(res.body.title).to.equal('weeeewoooo');
      expect(res.body.userID).to.equal(this.tempUser._id.toString());
      done();
    })
    .catch(done);
    });
    it('should return a 401 error with no Authorization provided', (done) => {
      superagent.post(`${baseURL}/api/gallery`)
      .send({title: 'weeeewoooo'})
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      })
      .catch(done);
    });
    it('should return a 400 error if missing a field', (done) => {
      superagent.post(`${baseURL}/api/gallery`)
      .send('wut')
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

    it('should respond with 401 when no header is provided', (done) => {
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
  describe('testing DELETE /api/gallery/:id', function() {
    beforeEach(userMock.bind(this));
    beforeEach(galleryMock.bind(this));
    it('should return 204', (done) => {
      let frisbee = `${baseURL}/api/gallery/${this.tempGallery._id.toString()}`;
      superagent.delete(frisbee)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        expect(res.status).to.equal(204);
        done();
      })
      .catch(done);
    });
    it('should respond with a 401 error, when no authorization provided', (done) => {
      let frisbee = `${baseURL}/api/gallery/${this.tempGallery._id.toString()}`;
      superagent.delete(frisbee)
      .set('Authorization', `Bearer badtouch`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      })
      .catch(done);
    });
    it('should respond with a 404', (done) => {
      let frisbee = `${baseURL}/api/gallery/fakeID`;
      superagent.delete(frisbee)
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
