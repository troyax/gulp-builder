var gulp = require('gulp');

var builder = {};

builder.getTask = function (task, options, data) {
    return require(__dirname + "/src/tasks/" + task)(gulp, options, data);
};

builder.getUtil = function (util, options, data) {
    return require(__dirname + "/src/utils/" + util)(gulp, options, data, builder);
};

builder.getPlugin = function (plugin) {
    return require(plugin);
};

module.exports = builder;