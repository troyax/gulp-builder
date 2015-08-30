var fs = require('fs');
var _ = require('lodash');
var helper = require('./helper-js');

var addBuildTasks = function (gulp, config, application) {
    var applicationName = application.id;
    var applicationPath = config.root + application.path;
    var buildTask = {};

    var sassBuildTaskName = 'sass-' + currentModule + '-build';
    var htmlBuildTaskName = 'html-' + currentModule + '-build';

        //helper.addJavaScriptBuildTask(gulp, config, currentModule);

        //gulp.task(jsBuildTaskName, task('js-module-build', options, data) );

    return {
        buildTasks: buildTasks,
        modules: modules
    };
};

module.exports = {
    addBuildTasks: addBuildTasks
};