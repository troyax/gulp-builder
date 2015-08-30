/* ignored by test coverage */

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

window.expect = chai.expect;
window.sinon = sinon;
window.stub = sinon.stub;
window.spy = sinon.spy;