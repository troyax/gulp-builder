module.exports = function (gulp, plugins, options, data) {

    return function () {
        var directory = options.modules.root + data.module;
        var buildInfo = require(directory + '/' + options.modules.buildInfoFile);

        return  gulp.src(directory + '/' + buildInfo.sass.directory + buildInfo.sass.entry)
            .pipe(plugins.sass())
            .on('error', function (error) {
                console.log(error);
                this.emit('end')
            })
            .pipe(plugins.concat(buildInfo.sass.rename || 'app.css'))
            .pipe(plugins.gulpif(options.minify, plugins.cssmin()))
            .pipe(gulp.dest( options.build.root + buildInfo.destination + 'css/' ))
            .pipe(plugins.browserSync.reload({stream: true}));
    };

};