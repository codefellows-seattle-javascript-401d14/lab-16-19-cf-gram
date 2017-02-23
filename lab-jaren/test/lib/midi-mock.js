'use strict';

const debug = require('debug')('midigram:midi-mock');
const Midi = require('../../model/midi.js');

module.exports = function(done) {
  debug('mocking midi');
  new Midi({
    title: 'streetsahead' + Math.random(),
    awsKey: 'wat.jpg',
    midiURI: 'http://wat/wat.jpg',
    userID: this.tempUser._id.toString(),
  }).save()
  .then(midi => {
    this.tempMidi = midi;
    done();
  })
  .catch(done);
};
