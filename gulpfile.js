var gulp = require('gulp');
var argv = require('yargs').argv;
var exec = require('gulp-exec');
var rimraf = require('gulp-rimraf');

gulp.task('release', function () {
    var version = argv.version || 'patch';

    gulp.src('./package.json')
        .pipe(exec('npm version ' + version))
        .pipe(gulp.dest('./gulp-builder'))
        .pipe(exec('cd gulp-builder'))
        //.pipe(exec('npm publish'))
        .pipe(exec('cd ../'))
        .pipe(rimraf())
});