'use strict';

const debug = require('debug')('cf-gram:mockGallery');
const Gallery = require('../../model/Gallery');

module.exports = function(done){
  debug('mockGallery');
  new Gallery({
    title:  'test' + Math.floor(Math.random() * 100),
    userID: this.tempUser._id.toString(),
  }).save()
  .then(gallery => {
    this.tempGallery = gallery;
    done();
  })
  .catch(done);
};
