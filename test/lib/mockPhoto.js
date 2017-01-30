'use strict';

const debug = require('debug')('cfgram:photo-mock');
const Photo = require('../../model/photo.js');

module.exports = function(done){
  debug('mocking photo');
  new Photo({
    title: 'pretendphoto' + Math.random(),
    userID: this.tempUser._id.toString(),
    sodacollectionID: this.tempSoda._id.toString(),
    // awsKey: 'wat.jpg',
    photoURI: 'http://wat/wat.jpg',
  }).save()
  .then(photo => {
    this.tempPhoto = photo;
    done();
  })
  .catch(done);
};
