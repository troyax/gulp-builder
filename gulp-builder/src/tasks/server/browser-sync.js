var browserSync = require('browser-sync');
var _ = require('lodash');

var getDepthPattern = function (depth, depthLevel) {
    var depthPattern = '';

    if (depthLevel < depth) {
        depthPattern = '**/' + getDepthPattern(depth, depthLevel + 1);
    }

    return depthPattern;
};

var processPatterns = function (config) {
    var files = config.files;
    var depth = (config.depth || 3) + 1;
    var filePattern = config.fileNamePattern;
    var patternsToWatch = [];


    _.each(files, function (pattern) {
        var index = 0;

        for (index; index < depth; index++) {
            patternsToWatch.push(pattern + getDepthPattern(index, 0) + filePattern)
        }
    });

    return patternsToWatch;
};

var addBrowserSyncTask = function (gulp, config, applicationTasks) {

    gulp.task('browser-sync', function (cb) {
        browserSync.init({
            server: {
                baseDir: config.root + config.build.dir
            },
            port: '8080'
        });

        _.each(config.applications, function (application) {
            var applicationFullPath = config.root + application.path;

            gulp.watch(processPatterns({
                fileNamePattern: '*.js',
                files: [applicationFullPath]
            }), [application.id + ':build-js'], browserSync.reload);
            gulp.watch(processPatterns({
                fileNamePattern: '*.scss',
                files: [applicationFullPath]
            }), [application.id + ':build-sass'], browserSync.reload);
            gulp.watch(processPatterns({
                fileNamePattern: '*.html',
                files: [applicationFullPath]
            }), [application.id + ':build-html'], browserSync.reload);
        });

        gulp.watch(processPatterns(config.watch.js), applicationTasks.js, browserSync.reload);
        gulp.watch(processPatterns(config.watch.sass), applicationTasks.sass, browserSync.reload);

        cb();
    });
};

module.exports = {
    addBrowserSyncTask: addBrowserSyncTask
};