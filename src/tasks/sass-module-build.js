module.exports = function (gulp, options, data) {
    var sass = require('gulp-sass');
    var concat = require('gulp-concat');
    var gulpif = require('gulp-if');
    var cssmin = require('gulp-minify-css');
    var browserSync = require('browser-sync');

    return function () {
        var directory = options.modules.root + data.module;
        var buildInfo = require(directory + '/' + options.modules.buildInfoFile);

        var files = [
            directory + '/' + buildInfo.sass.directory + buildInfo.sass.entry
        ];

        if (buildInfo.sass['font-awesome']) {
            files.unshift('../../node_modules/font-awesome/scss/font-awesome.scss');

            gulp.src('../../node_modules/font-awesome/fonts/*')
                .pipe(gulp.dest(options.build.root + buildInfo.destination + 'fonts/'));
        }

        return  gulp.src(files)
                    .pipe(sass())
                    .on('error', function (error) {
                        console.log(error);
                        this.emit('end')
                    })
                    .pipe(concat(buildInfo.sass.rename || 'app.css'))
                    .pipe(gulpif(options.minify, cssmin()))
                    .pipe(gulp.dest(options.build.root + buildInfo.destination + 'css/'))
                    .pipe(browserSync.reload({stream: true}));
    };

};