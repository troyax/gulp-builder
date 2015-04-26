module.exports = function (gulp, plugins, options) {
    return function (callback) {
        var streams;

        plugins._.forIn(options.applications, function (application, index) {
            var stream;
            var destinationPath = options.target + options.sass.destination;

            stream = gulp.src(options.sass.sources)
                .pipe(plugins.concat(options.sass.name))
                .pipe(plugins.sass())
                .on('error', function (error) {
                    console.log(error);
                    this.emit('end');
                })
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