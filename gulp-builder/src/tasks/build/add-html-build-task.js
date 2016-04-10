var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var handlebars = require('gulp-compile-handlebars');
var path = require('path');
var lodash = require('lodash');

var generateBundle = function (gulp, config) {
    var bundle = gulp.src(config.filePath).on('error', function (error) {
        console.log(error);
        this.emit('end');
    });
    var prefix = '';

    lodash.times(config.depth || 0, function () {
        prefix = path.join(prefix, '..');
    });

    if (prefix.length) {
        prefix = prefix + '/';
    }

    bundle = bundle.pipe(handlebars({
        prefix: prefix
    })).pipe(concat(config.fileName || 'index.html')).pipe(gulp.dest(config.destination));

    return bundle;
};

module.exports = function (gulp, config, application, taskName) {
    var destination = path.join(config.root, config.build.dir, (application.destination || ''));
    var mainFile = path.join(config.root, (application.path || ''), (application.build.html.entry || 'index.html'));
    var routes = application.routes;

    gulp.task(taskName, function () {
        var bundle = generateBundle(gulp, {
            filePath: mainFile,
            fileName: application.build.html.rename,
            destination: destination
        });

        if (routes) {
            lodash.each(routes.files, function (file) {
                bundle = generateBundle(gulp, {
                    filePath: mainFile,
                    fileName: file.name,
                    depth: file.depth,
                    destination: path.join(destination, file.destination || '')
                });
            });
        }

        return bundle.pipe(browserSync.reload({stream: true}));
    });
};