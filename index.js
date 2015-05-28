var gulp = require('gulp');

var getTask = function (task, options, data) {
    return require(__dirname + "/src/tasks/" + task)(gulp, options, data);
};

var getUtil = function (util, options, data) {
    return require(__dirname + "/src/utils/" + util)(gulp, options, data, this);
};

var getPlugin = function (plugin) {
    return require(plugin);
};

module.exports = {
    getTask: getTask,
    getUtil: getUtil,
    getPlugin: getPlugin
};
