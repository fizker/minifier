global.chai = require('chai');
global.expect = chai.expect;
global.sinon = require('sinon');

chai.use(require('sinon-chai'));

require('./helpers/sinon').extend(sinon);
require('./helpers/chai').addMethods(chai);
