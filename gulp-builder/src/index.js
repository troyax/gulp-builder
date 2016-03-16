var _ = require('lodash');
var buildTaskGenerator = require('gulp-builder/src/tasks/build/task-generator');
var componentsBuildTaskGenerator = require('gulp-builder/src/tasks/components/task-generator');
var addBrowserSyncTask = require('gulp-builder/src/tasks/server/browser-sync').addBrowserSyncTask;
var addSourcesTasks = require('gulp-builder/src/tasks/sources/task-generator').addSourcesTasks;
var runSequence = require('run-sequence');

var processRoot = function (root) {

    if (root && (root.length - 1) !== root.lastIndexOf('/')) {
        root = root + '/';
    }

    return root;
};

var addGulpTasks = function (gulp, config) {
    var applications;
    var components;
    var sources;
    var applicationTasks = {
        main: [],
        js: [],
        sass: [],
        html: []
    };

    process.env.NODE_PATH = config.root;

    config = config || {};

    applications = config.applications;

    components = config.components;

    sources = config.sources || {};

    config.root = processRoot(config.root);

    if (applications) {
        _.each(applications, function (application) {
            var taskNames = buildTaskGenerator.addBuildTasks(gulp, config, application);

            application.requiredFilePaths = [];
            applicationTasks.main.push(taskNames.main);
            applicationTasks.js.push(taskNames.js);
            applicationTasks.sass.push(taskNames.sass);
            applicationTasks.html.push(taskNames.html);
        });
    }

    if (components) {
        componentsBuildTaskGenerator.addComponentsBuildTasks(gulp, config, components);

        gulp.task('pre-publish-components', ['components:build-js', 'components:build-scss'], function (cb) {});
    }

    if (sources) {

        if (sources.icons) {
            _.each(sources.icons, function (icons) {
                applicationTasks.main.push(icons + '-icons');
            });
        }
    }

    addBrowserSyncTask(gulp, config, applicationTasks);

    addSourcesTasks(gulp, config);

    gulp.task('default', function (cb) {
        runSequence(applicationTasks.main, 'browser-sync', cb);
    });

};

module.exports = {
    addGulpTasks: addGulpTasks,
    processRoot: processRoot
};