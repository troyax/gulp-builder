module.exports = function (gulp, plugins, options, data) {
    var jsWatchPatterns = [options.modules.root + module + '/*.js', config.modules.root + module + '/**/*.js', config.modules.root + module + '/**/**/*.js'];
    var sassWatchPatterns = [options.modules.root + module + '/*.scss', config.modules.root + module + '/**/*.scss', config.modules.root + module + '/**/**/*.scss'];
    var htmlWatchPatterns = [options.modules.root + module + '/*.html', config.modules.root + module + '/**/*.html', config.modules.root + module + '/**/**/*.html'];

    return function () {
        var buildTasks = data.buildTasks;
        var modules = data.modules;

        _.browserSync.init({
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