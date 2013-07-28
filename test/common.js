global.chai = require('chai');
global.expect = chai.expect;

global.fzkes = require('fzkes')
chai.use(fzkes.chai)

require('finc-chai-helpers').addMethods(chai);
