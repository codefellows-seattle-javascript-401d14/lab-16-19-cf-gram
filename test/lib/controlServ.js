'use strict';

const server = require('../../server');

const controlServ = module.exports = {};

controlServ.startServ = function(done) {
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
