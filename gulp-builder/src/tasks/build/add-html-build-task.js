var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var handlebars = require('gulp-compile-handlebars');
var path = require('path');

module.exports = function (gulp, config, application, taskName) {
    var destination = path.join(config.root, config.build.dir, (application.destination || ''));
    var mainFile = path.join(config.root, (application.path || ''), (application.build.html.entry || 'index.html'));

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