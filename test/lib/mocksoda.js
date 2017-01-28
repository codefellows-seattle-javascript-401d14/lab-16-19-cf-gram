'use strict';

const debug = require('debug')('cfgram:soda-mock');
const Soda = require('../../model/sodacollection.js');

module.exports = function(done){
  debug('mock soda function');
  new Soda ({
    brand: 'Pepsi' + Math.random(),
    diet: true,
    taste: 'yum',
    SodaId: this.tempUser._id.toString(),
  }).save()
  .then(soda => {
    this.tempSoda = soda;
    done();
  })
  .catch(done);
};
