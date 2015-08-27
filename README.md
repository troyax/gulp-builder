# gulp-builder
Gulp builder project, used to build all kind of project, intended to have flexibility for each one of them.
Includes all kind of tasks and utils 

** *DO NOT USE [not stable version, estimated release: November 2015], sorry for the delay caused by personal issues* **

Still pending to do a full refactor of the package logic and also adding new functionality like:
-   Building for publishing projects
-   Support for multiple JS frameworks
-   Support for Material Design Iconfont
-   Much more

## Installation

`npm install --save-dev gulp-builder`

## Usage

Inside your gulpfile.js:

```javascript
var builder = require('gulp-builder');
var run = builder.getPlugin('run-sequence');
var gulp = builder.getPlugin('gulp');
var argv = builder.getPlugin('yargs').argv;
var task = builder.getTask;
var util = builder.getUtil;

var options = {
    root: __dirname,
    minify: (argv.production || argv.minify) || false,
    build: {
        root: __dirname + '/app/'
    },
    modules: {
        root: __dirname + '/app-modules/',
        buildInfoFile: 'build-info'
    },
    'core-watch': {
        js: [
            __dirname + '/core/data/*.js',
            __dirname + '/core/components/*.js',
            __dirname + '/core/components/mixins/*.js'
        ],
        sass: [
            __dirname + '/core/components/*.scss',
            __dirname + '/core/components/mixins/*.scss',
            __dirname + '/core/sass/*.scss',
            __dirname + '/core/sass/**/*.scss'
        ]
    }
};

var data = util('build-js-tasks', options);
var buildTasks = data.buildTasks;

gulp.task('browser-sync', task('browser-sync', options, data));
```

Will build your configured module (with the build-info.js file inside the modules directory) with browserify and the
transforms needed.

## More information

For more information please visit https://github.com/troianoandres/gulp-builder/wiki

## Estimated Release

This package is still in dev and is not stable. Estimated release on August of 2015.