module.exports = function (gulp, plugins, options) {
    return function (callback) {
        var streams;

        plugins._.forIn(options.applications, function (application, index) {
            var stream;
            var destinationPath = options.target + application.folder + application.build.js;

            stream = plugins.browserify(application.main)
                .transform(plugins.reactify).bundle()
                .on('error', function (error) {
                    console.log(error);
                    this.emit('end');
                })
                .pipe(plugins.source('app.js'))
                .pipe(plugins.buffer())
                .pipe(plugins.gulpif(
                    options.minify || options.production,
                    plugins.uglify()
                ))
                .pipe(gulp.dest(destinationPath));

            if (streams) {
                streams.add(stream);
            } else {
                streams = plugins.mergeStream(stream);
            }
        });

        return streams;
    };

};