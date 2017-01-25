'use strict';

const debug = require('debug')('cfgram:gallery-mock');
const Gallery = require('../../model/gallery.js');

module.exports = function(done){
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
