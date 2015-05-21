module.exports = function (gulp, plugins, options, data) {

    return function () {
        var directory = options.modules.root + data.module;
        var buildInfo = require(directory + '/' + options.modules.buildInfoFile);

        return gulp.src(directory + '/' + buildInfo.html.directory + buildInfo.html.entry)
            .on('error', function (error) {
                console.log(error);
                this.emit('end')
            })
            .pipe(plugins.handlebars(data.htmlTemplateData))
            .pipe(plugins.concat(buildInfo.html.rename))
            .pipe(gulp.dest(options.build.root + buildInfo.destination))
            .pipe(plugins.browserSync.reload({stream: true}));
    };

};