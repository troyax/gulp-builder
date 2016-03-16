var gulpif = require('gulp-if');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var cssmin = require('gulp-minify-css');
var fs = require('fs');
var lodash = require('lodash');
var path = require('path');
var updateSassCompilationOrder = require('./update-sass-compilation-order');

module.exports = function (gulp, config, application, taskName) {
    var destination = path.join(config.root, config.build.dir, (application.destination || ''));
    var mainFile = path.join(config.root, (application.path || ''), (application.build.sass.entry || 'index'));

    /*
     if (buildInfo.sass['fontAwesome']) {
     files.unshift(options.root + '/node_modules/gulp-builder/node_modules/font-awesome/scss/font-awesome.scss');

     gulp.src(options.root + '/node_modules/gulp-builder/node_modules/font-awesome/fonts/*')
     .pipe(gulp.dest(options.build.root + buildInfo.destination + 'fonts/'));
     }
     */

    gulp.task(taskName, function () {
        var bundle;
        var filesToCompile = ['sass/main', mainFile].concat(lodash.filter(application.requiredFilePaths, function (file, index) {
            var value = false;

            try {
                value = fs.statSync(file + '.scss');
            } catch (error) {}

            return Boolean(value);
        }));

        filesToCompile = updateSassCompilationOrder(filesToCompile, config.fileDependencies);

        filesToCompile = lodash.map(filesToCompile, function (fileId) {
            return fileId + '.scss';
        });

        bundle = gulp.src(filesToCompile).pipe(sass()).on('error', function (error) {
            console.log(error);
            this.emit('end');
        });

        return  bundle.pipe(concat(application.build.sass.rename || 'style.css'))
            .pipe(gulpif(config.minify, cssmin()))
            .pipe(gulp.dest(path.join(destination, 'css')))
            .pipe(browserSync.reload({stream: true}));
    });
};