module.exports = function (gulp, options, data) {
    var browserSync = require('browser-sync');

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
            var currentModule = modules[index];
            var jsWatchPatterns = [
                options.modules.root + currentModule + '/*.js', 
                options.modules.root + currentModule + '/**/*.js', 
                options.modules.root + currentModule + '/**/**/*.js'
                ];
            var sassWatchPatterns = [
                options.modules.root + currentModule + '/*.scss', 
                options.modules.root + currentModule + '/**/*.scss', 
                options.modules.root + currentModule + '/**/**/*.scss'
            ];
            var htmlWatchPatterns = [
                options.modules.root + currentModule + '/*.html', 
                options.modules.root + currentModule + '/**/*.html', 
                options.modules.root + currentModule + '/**/**/*.html'
            ];

            gulp.watch(jsWatchPatterns, ['js-' + currentModule + '-build']);
            gulp.watch(sassWatchPatterns, ['sass-' + currentModule + '-build']);
            gulp.watch(htmlWatchPatterns, ['html-' + currentModule + '-build']);
        }

    };

};