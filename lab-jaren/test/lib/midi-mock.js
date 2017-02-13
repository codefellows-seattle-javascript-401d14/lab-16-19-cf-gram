'use strict';

const debug = require('debug')('midigram:midi-mock');
const Midi = require('../../model/midi.js');

module.exports = function(done) {
  debug('mocking midi');
  new Midi({
    title: 'lulwat' + Math.random(),
    userID: this.tempUser._id.toString(),
    galleryID: this.tempGallery._id.toString(),
    awsKey: 'wat.jpg',
    midiURI: 'http://wat/wat.jpg',
  }).save()
  .then(midi => {
    this.tempMidi = midi;
    done();
  })
  .catch(done);
};
