var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var gulpif = require('gulp-if');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var handlebars = require('gulp-compile-handlebars');
var cssmin = require('gulp-minify-css');

var addJavaScriptBuildTask = function (gulp, config, application, taskName) {
    var destination = config.root + config.build.dir + (application.destination || '');
    var mainFile = config.root + (application.path || '') + (application.build.js.entry || 'index.js');

    gulp.task(taskName, function () {
        var bundle = browserify(mainFile).transform(reactify).bundle().on('error', function (error) {
            console.log(error);
            this.emit('end')
        });

        return bundle.pipe(source( application.build.js.rename || 'app.js' ))
            .pipe(gulpif(config.minify, buffer()))
            .pipe(gulpif(config.minify, uglify()))
            .pipe(gulp.dest( destination + 'js/' ))
            .pipe(browserSync.reload({stream: true}));
    });
};

var addSassBuildTask = function (gulp, config, application, taskName) {
    var destination = config.root + config.build.dir + (application.destination || '');
    var mainFile = config.root + (application.path || '') + (application.build.sass.entry || 'main.scss');
    var files = [mainFile];

    /*
    if (buildInfo.sass['fontAwesome']) {
        files.unshift(options.root + '/node_modules/gulp-builder/node_modules/font-awesome/scss/font-awesome.scss');

        gulp.src(options.root + '/node_modules/gulp-builder/node_modules/font-awesome/fonts/*')
            .pipe(gulp.dest(options.build.root + buildInfo.destination + 'fonts/'));
    }
    */

    gulp.task(taskName, function () {
        var bundle = gulp.src(files).pipe(sass()).on('error', function (error) {
            console.log(error);
            this.emit('end')
        });

        return  bundle.pipe(concat(application.build.sass.rename || 'style.css'))
            .pipe(gulpif(config.minify, cssmin()))
            .pipe(gulp.dest(destination + 'css/'))
            .pipe(browserSync.reload({stream: true}));
    });
};

var addHTMLBuildTask = function (gulp, config, application, taskName) {
    var destination = config.root + config.build.dir + (application.destination || '');
    var mainFile = config.root + (application.path || '') + (application.build.html.entry || 'index.html');

    gulp.task(taskName, function () {
        var bundle = gulp.src(mainFile).on('error', function (error) {
            console.log(error);
            this.emit('end')
        });

        return bundle.pipe(handlebars({}))
            .pipe(concat(application.build.html.rename || 'index.html'))
            .pipe(gulp.dest(destination))
            .pipe(browserSync.reload({stream: true}));
    });
};

module.exports = {
    addJavaScriptBuildTask: addJavaScriptBuildTask,
    addSassBuildTask: addSassBuildTask,
    addHTMLBuildTask: addHTMLBuildTask
};