var _ = require('lodash');
var buildTaskGenerator = require('./tasks/build/task-generator');
var addBrowserSyncTask = require('./tasks/server/browser-sync').addBrowserSyncTask;

var processRoot = function (root) {

    if (root && (root.length - 1) !== root.lastIndexOf('/')) {
        root = root + '/';
    }

    return root;
};

var addGulpTasks = function (gulp, config) {
    var applications;
    var applicationTasks = {
        main: [],
        js: [],
        sass: [],
        html: []
    };

    config = config || {};

    applications = config.applications;

    config.root = processRoot(config.root);

    if (applications) {
        _.each(applications, function (application) {
            var taskNames = buildTaskGenerator.addBuildTasks(gulp, config, application);
            applicationTasks.main.push(taskNames.main);
            applicationTasks.js.push(taskNames.js);
            applicationTasks.sass.push(taskNames.sass);
            applicationTasks.html.push(taskNames.html);
        });
    }

    addBrowserSyncTask(gulp, config, applicationTasks);

    gulp.task('default', applicationTasks.main.concat(['browser-sync']), function (cb) {});
};

module.exports = {
    addGulpTasks: addGulpTasks,
    processRoot: processRoot
};