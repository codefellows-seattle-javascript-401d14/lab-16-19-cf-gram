'use strict';

const Album = require('../../model/album.js');
const debug = require('debug')('cfgram:album-mock');

module.exports = function(done){
  debug('album-mock');
  console.log('this.tempUser', this.tempUser._id.toString());
  new Album({
    title: 'fake Title' + Math.random(),
    userID: this.tempUser._id.toString(),
  }).save()
  .then(album => {
    console.log('album.userID', album.userID);
    this.tempAlbum = album;
    done();
  })
  .catch(done);
};
