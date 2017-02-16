'use strict';

const debug = require('debug')('midigram:gallery-mock');
const Gallery = require('../../model/gallery.js');

module.exports = function(done) {
  debug('mock gallery');
  new Gallery({
    title: 'lulwat' + Math.random(),
    description: 'cool' + Math.random(),
    userID: this.tempUser._id.toString(),
  }).save()
  .then(gallery => {
    this.tempGallery = gallery;
    done();
  })
  .catch(done);
};
