'use strict';

process.env.PORT = 4000;
process.env.MONGODB_URI = 'mongodb://localhost/test';
process.env.APP_SECRET = 'lualalaualuakoala';
process.env.AWS_BUCKET = 'lulwat';
process.env.AWS_ACCESS_KEY_ID = 'fakekey';
process.env.AWS_SECRET_ACCESS_KEY = 'fakesecretkey';

require('./lib/aws-mocks.js');
