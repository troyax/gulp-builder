var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var gulpif = require('gulp-if');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var handlebars = require('gulp-compile-handlebars');
var cssmin = require('gulp-minify-css');
var fs = require('fs');
var lodash = require('lodash');
var path = require('path');

var addJavaScriptBuildTask = function (gulp, config, application, taskName) {
    var destination = path.join(config.root, config.build.dir, (application.destination || ''));
    var mainFile = path.join(config.root, (application.path || ''), (application.build.js.entry || 'index.js'));

    gulp.task(taskName, function () {
        var bundle = browserify(mainFile);
        var pipeline = bundle.pipeline;

        pipeline.on('file', function (filePath, fileId) {
            if (filePath.indexOf('node_modules') === -1) {
                application.requiredFilePaths.push(fileId);
            }
        });

        bundle = bundle.transform(reactify).bundle().on('error', function (error) {
            console.log(error);
            this.emit('end');
        });

        return bundle.pipe(source(application.build.js.rename || 'app.js' ))
            .pipe(gulpif(config.minify, buffer()))
            .pipe(gulpif(config.minify, uglify()))
            .pipe(gulp.dest(path.join(destination, 'js')))
            .pipe(browserSync.reload({stream: true}));
    });
};

var addSassBuildTask = function (gulp, config, application, taskName) {
    var destination = path.join(config.root, config.build.dir, (application.destination || ''));
    var mainFile = path.join(config.root, (application.path || ''), (application.build.sass.entry || 'index'));

    /*
     if (buildInfo.sass['fontAwesome']) {
     files.unshift(options.root + '/node_modules/gulp-builder/node_modules/font-awesome/scss/font-awesome.scss');

     gulp.src(options.root + '/node_modules/gulp-builder/node_modules/font-awesome/fonts/*')
     .pipe(gulp.dest(options.build.root + buildInfo.destination + 'fonts/'));
     }
     */

    gulp.task(taskName, function () {
        var bundle;
        var filesToCompile = ['sass/main', mainFile].concat(lodash.filter(application.requiredFilePaths, function (file, index) {
            var value = false;

            try {
                value = fs.statSync(file + '.scss');
            } catch (error) {}

            return Boolean(value);
        }));


        filesToCompile = lodash.map(filesToCompile, function (fileId) {
            return fileId + '.scss';
        });

        filesToCompile = updateCompilationOrder(filesToCompile, config.fileDependencies);

        bundle = gulp.src(filesToCompile).pipe(sass()).on('error', function (error) {
            console.log(error);
            this.emit('end');
        });

        return  bundle.pipe(concat(application.build.sass.rename || 'style.css'))
            .pipe(gulpif(config.minify, cssmin()))
            .pipe(gulp.dest(path.join(destination, 'css')))
            .pipe(browserSync.reload({stream: true}));
    });
};

var addHTMLBuildTask = function (gulp, config, application, taskName) {
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

var updateCompilationOrder = function (filesToCompile, dependencies) {

    lodash.forEach(filesToCompile, function (fileId, fileIndex) {
        var indexToBeMoved = fileIndex;
        var aux;

        if (dependencies[fileId]) {
            lodash.forEach(dependencies, function (otherFileDependencies, key) {
                var consumerIndex;

                if (otherFileDependencies.indexOf(fileId) > -1) {
                    consumerIndex = filesToCompile.indexOf(key);

                    if (indexToBeMoved > consumerIndex) {
                        indexToBeMoved = consumerIndex;
                    }
                }
            });

            aux = filesToCompile[indexToBeMoved];
            filesToCompile[indexToBeMoved] = fileId;
            filesToCompile[fileIndex] = aux;
        }
    });

    return filesToCompile;
};

module.exports = {
    addJavaScriptBuildTask: addJavaScriptBuildTask,
    addSassBuildTask: addSassBuildTask,
    addHTMLBuildTask: addHTMLBuildTask,
    updateCompilationOrder: updateCompilationOrder
};