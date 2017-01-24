'use strict';

//require mock env
require('./mock-env.js');
//npm modules
const expect = require('chai').expect;
const superagent = require('superagent');
//app modules
const User = require('../model/user.js');
//start server
const baseUrl = `http://localhost:${process.env.PORT}`;
const server = require('../server.js');
//mctesterson shredstone shreddy davis tester

describe('testing auth-router', function(){
  //start the server if it is not running
  before(done => {
    if(!server.isRunning){
      server.listen(process.env.PORT, () => {
        console.log('SERVER UP ☺☻☺');
        done();
      });
      return;
    }
    done();
  });

  //stop the server if it is running
  after(done => {
    if(server.isRunning){
      server.close(() => {
        server.isRunning = false;
        console.log('SERVER DOWN ─=≡Σ((( つ◕ل͜◕)つ');
        done();
      });
      return;
    }
    done();
  });

  afterEach((done) => {
    User.remove({})
    .then(() => done())
    .catch(done);
  });

  describe('testing POST /api/signup', function(){
    it('should return a user', function(done){
      superagent.post(`${baseUrl}/api/signup `)
      .send({
        username: 'words and stufdf',
        email: 'jellobeansnot@carcolepsy.com',
        password: 'more words and stuff',
      })
      .then(res => {
        console.log('token: ', res.text);
        expect(res.status).to.equal(200);
        expect(Boolean(res.text)).to.equal(true);
        done();
      })
      .catch(done);
    });

    it('should return a 400 if missing field', function(done){
      superagent.post(`${baseUrl}/api/signup `)
      .send({username: ' ', password: ' '})
    .then(done)
      .catch(err => {
        expect(err.status).to.equal(400);
        done();
      })
      .catch(done);
    });

    describe('testing POST /api/signup for 409', function(){
      before(done => {
        superagent.post(`${baseUrl}/api/signup `)
        .send({username: '(⌐■_■)–︻╦╤─ – – –', email: 'epiphenot@carcolepsy.com', password: '(♥_♥)'})
        .then(() => done())
        .catch(err => {
          console.error(err);
          done();
        });
      });
      it('should return a 409 if username taken', function(done){
        superagent.post(`${baseUrl}/api/signup `)
          .send({username: '(⌐■_■)–︻╦╤─ – – –', email: 'epiphenot@carcolepsy.com', password: '(♥_♥)'})
        .then(done)
        .catch(err => {
          console.log(err, 'whats going on here?');
          expect(err.status).to.equal(409);
          done();
        })
        .catch(done);
      });
    });
  });
});
