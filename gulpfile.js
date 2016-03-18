var gulp = require('gulp');
var exec = require('child_process').exec;
var del = require('del');
var runSequence = require('run-sequence');
var argv = require('yargs').argv;

gulp.task('release:update', function (cb) {
    var version = argv.version || 'patch';

    exec('npm version ' + version, function (err) {
        cb(err);
    });
});

gulp.task('release:move-files', function () {
    return gulp.src(['./package.json', './README.md']).pipe(gulp.dest('./gulp-builder'));
});

gulp.task('release:publish', function (cb) {
    exec('npm publish ./gulp-builder', function (err) {
        cb(err);
    });
});

gulp.task('release:clean', function (cb) {
    del(['./gulp-builder/package.json', './gulp-builder/README.md']);

    cb();
});

gulp.task('release', function (cb) {
    runSequence('release:update', 'release:move-files', 'release:publish', 'release:clean', cb);
});