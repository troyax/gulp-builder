# gulp-builder
All kind of tasks and utils for gulp (do not use [not stable version, estimated release: August 2015])

## Installation

`npm install --save-dev gulp-builder`

## Usage

Inside your gulpfile.js:

```javascript
var gulp = require('gulp');
var builder = require('gulp-builder');

var options = {
    root: __dirname,
    build: {
        root: __dirname + '/app/'
    },
    modules: {
        root: __dirname + '/app-modules/',
        buildInfoFile: 'build-info'
    }
};
var data = {module: 'main-app'};

gulp.task('js-main-app-build', builder.getTask('js-module-build', options, data));
```

Will build your configured module (with the build-info.js file inside the modules directory) with browserify and the
transforms needed.

## More information

For more information please visit https://github.com/troianoandres/gulp-builder/wiki

## Estimated Release

This package is still in dev and is not stable. Estimated release on August of 2015.