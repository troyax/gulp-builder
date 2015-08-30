var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var gulpif = require('gulp-if');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
//var browserSync = require('browser-sync');

var addJavaScriptBuildTask = function (gulp, config, currentModule) {
    var modulesConfig = config.modules;
    var directory = config.root + modulesConfig.path;
    var buildInfo = require(directory + modulesConfig.buildInfo);
    var mainFile = directory + (buildInfo.js.directory || '') + (buildInfo.js.entry || 'index.js');
    var taskName = currentModule + ':build-js';
    /*
    gulp.task(taskName, function () {
        return browserify(mainFile)
            .transform(reactify)
            .bundle()
            .on('error', function (error) {
                console.log(error);
                this.emit('end')
            })
            .pipe(source( buildInfo.js.rename || 'app.js' ))
            .pipe(gulpif(options.minify, buffer()))
            .pipe(gulpif(options.minify, uglify()))
            .pipe(gulp.dest( options.build.root + buildInfo.destination + 'js/' ))
            .pipe(browserSync.reload({stream: true}));
    });
    */
};

module.exports = {
    addJavaScriptBuildTask: addJavaScriptBuildTask
};