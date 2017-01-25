'use strict';

const debug = require('debug')('exchange-o-gram: gallery-mock');
const Gallery = require('../../model/gallery.js');

module.exports = function(done){
  debug('gallery-mock');
  new Gallery({
    title: 'lulwat' + Math.random(),
    userID: this.tempUser._id.toString(),
  }).save()
  .then(gallery => {
    this.tempGallery = gallery;
    done();
  })
  .catch(done);
};
