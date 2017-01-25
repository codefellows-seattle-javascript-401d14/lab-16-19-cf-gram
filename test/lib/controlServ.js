'use strict';

const debug = require('debug')('cf-gram:controlServ');
const server = require('../../server');

const controlServ = module.exports = {};
debug('controlServ');
controlServ.startServ = function(done) {
  debug('controlServ.startServ');
  if(!server.isRunning){
    server.listen(process.env.PORT, () => {
      server.isRunning = true;
      console.log('server up');
      done();
    });
    return;
  }
  done();
};

controlServ.killServ = function(done) {
  debug('controlServ.killServ');
  if(server.isRunning){
    server.close(() => {
      server.isRunning = false;
      console.log('server down');
      done();
    });
    return;
  }
  done();
};
