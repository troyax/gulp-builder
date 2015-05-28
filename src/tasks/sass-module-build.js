module.exports = function (gulp, options, data) {
    var sass = require('gulp-sass');
    var concat = require('gulp-concat');
    var gulpif = require('gulp-if');
    var cssmin = require('gulp-minify-css');
    var browserSync = require('browser-sync');

    return function () {
        var directory = options.modules.root + data.module;
        var buildInfo = require(directory + '/' + options.modules.buildInfoFile);

        return  gulp.src(directory + '/' + buildInfo.sass.directory + buildInfo.sass.entry)
                    .pipe(sass())
                    .on('error', function (error) {
                        console.log(error);
                        this.emit('end')
                    })
                    .pipe(concat(buildInfo.sass.rename || 'app.css'))
                    .pipe(gulpif(options.minify, cssmin()))
                    .pipe(gulp.dest( options.build.root + buildInfo.destination + 'css/' ))
                    .pipe(browserSync.reload({stream: true}));
    };

};