var jsBuildModule = function (options, data) {
    var module = data.module;
    var directory = options.modules.root + module;
    var buildInfo = require(directory + '/' + options.modules.buildInfoFile);

    return browserify(directory + '/' + buildInfo.entry).transform(reactify).bundle()
                .on('error', handleError)
                .pipe(source( buildInfo.rename || 'app.js' ))
                .pipe(gulpif(options.minify, buffer()))
                .pipe(gulpif(options.minify, uglify()))
                .pipe(gulp.dest( options.build.root + buildInfo.destination + 'js/' ))
                .pipe(browserSync.reload({stream: true}));
};

module.exports = function (gulp, plugins, options, data) {

    return function () { return jsBuildModule(options, data); };

};