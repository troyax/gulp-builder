var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var gulpif = require('gulp-if');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var path = require('path');

module.exports = function (gulp, config, application, taskName) {
    var destination = path.join(config.root, config.build.dir, (application.destination || ''));
    var mainFile = path.join(config.root, (application.path || ''), (application.build.js.entry || 'index.js'));
    var bundle;
    var pipeline;

    gulp.task(taskName, function () {
        bundle = browserify(mainFile);
        pipeline = bundle.pipeline;

        pipeline.on('file', function (filePath, fileId) {
            if (filePath.indexOf('node_modules') === -1) {
                application.requiredFilePaths.push(fileId);
            }
        });

        bundle = bundle.transform(reactify).bundle().on('error', function (error) {
            console.log(error);
            this.emit('end');
        });

        return bundle.pipe(source(application.build.js.rename || 'app.js' ))
            .pipe(gulpif(config.minify, buffer()))
            .pipe(gulpif(config.minify, uglify()))
            .pipe(gulp.dest(path.join(destination, 'js')))
            .pipe(browserSync.reload({stream: true}));
    });
};