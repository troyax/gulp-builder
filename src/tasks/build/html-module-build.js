module.exports = function (gulp, options, data) {
    var handlebars = require('gulp-compile-handlebars');
    var concat = require('gulp-concat');
    var browserSync = require('browser-sync');

    return function () {
        var directory = options.modules.root + data.module;
        var buildInfo = require(directory + '/' + options.modules.buildInfoFile);

        return gulp.src(directory + '/' + buildInfo.html.directory + buildInfo.html.entry)
            .on('error', function (error) {
                console.log(error);
                this.emit('end')
            })
            .pipe(handlebars(data.htmlTemplateData))
            .pipe(concat(buildInfo.html.rename))
            .pipe(gulp.dest(options.build.root + buildInfo.destination))
            .pipe(browserSync.reload({stream: true}));
    };

};