module.exports = function (gulp, plugins, options, data) {

    return function () {
        var directory = options.modules.root + data.module;
        var buildInfo = require(directory + '/' + options.modules.buildInfoFile);

        return plugins.browserify(directory + '/' + buildInfo.entry).transform(plugins.reactify).bundle()
            .on('error', function (error) {
                console.log(error);
                this.emit('end')
            })
            .pipe(plugins.source( buildInfo.rename || 'app.js' ))
            .pipe(plugins.gulpif(options.minify, plugins.buffer()))
            .pipe(plugins.gulpif(options.minify, plugins.uglify()))
            .pipe(gulp.dest( options.build.root + buildInfo.destination + 'js/' ))
            .pipe(plugins.browserSync.reload({stream: true}));
    };

};