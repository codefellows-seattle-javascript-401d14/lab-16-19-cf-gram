'use strict';

const server = require('../server.js');

const serverControl = module.exports = {};

serverControl.startServer = function (done){

  before(done => {
    if(!server.isRunning){
      server.listen(process.env.PORT, () => {
        server.isRunning = true;
        console.log('server up');
        done();
      });
      return;
    }
    done();
  });
  done();
};

serverControl.turnoffServer = function(done) {
  after(done => {
    if(server.isRunning){
      server.close(() => {
        server.isRunning = false;
        console.log('server down');
        done();
      });
      return;
    }
    done();
  });
  done();
};
