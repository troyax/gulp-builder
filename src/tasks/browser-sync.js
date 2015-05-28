module.exports = function (gulp, options, data) {
    var browserSync = require('browser-sync');

    var jsWatchPatterns = [options.modules.root + module + '/*.js', options.modules.root + module + '/**/*.js', options.modules.root + module + '/**/**/*.js'];
    var sassWatchPatterns = [options.modules.root + module + '/*.scss', options.modules.root + module + '/**/*.scss', options.modules.root + module + '/**/**/*.scss'];
    var htmlWatchPatterns = [options.modules.root + module + '/*.html', options.modules.root + module + '/**/*.html', options.modules.root + module + '/**/**/*.html'];



    return function () {
        var buildTasks = data.buildTasks;
        var modules = data.modules;

        browserSync.init({
            server: {
                baseDir: options.build.root
            },
            port: '8080'
        });

        gulp.watch(options['core-watch'].js, buildTasks.js, browserSync.reload);
        gulp.watch(options['core-watch'].sass, buildTasks.sass, browserSync.reload);

        for (var index = 0; index < modules.length; index++) {
            var module = modules[index];

            gulp.watch(jsWatchPatterns, ['js-' + module + '-build']);
            gulp.watch(sassWatchPatterns, ['sass-' + module + '-build']);
            gulp.watch(htmlWatchPatterns, ['html-' + module + '-build']);
        }

    };

};