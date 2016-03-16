var path = require('../../node_modules/path/path');

path.join = spy(path, 'join');

module.exports = path;