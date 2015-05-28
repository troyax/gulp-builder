module.exports = function (gulp, plugins, options, data) {
    var browserify = require('browserify');
    var reactify = require('reactify');
    var source = require('vinyl-source-stream');
    var gulpif = require('gulp-if');
    var buffer = require('vinyl-buffer');
    var uglify = require('gulp-uglify');
    var browserSync = require('browser-sync');


    return function () {
        var directory = options.modules.root + data.module;
        var buildInfo = require(directory + '/' + options.modules.buildInfoFile);

        return browserify(directory + '/' + buildInfo.entry).transform(reactify).bundle()
            .on('error', function (error) {
                console.log(error);
                this.emit('end')
            })
            .pipe(source( buildInfo.rename || 'app.js' ))
            .pipe(gulpif(options.minify, buffer()))
            .pipe(gulpif(options.minify, uglify()))
            .pipe(gulp.dest( options.build.root + buildInfo.destination + 'js/' ))
            .pipe(browserSync.reload({stream: true}));
    };

};