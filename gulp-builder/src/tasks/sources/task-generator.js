// VENDOR LIBS
var path = require('path');

var addSourcesTasks = function (gulp, config) {
    var destination = path.join(config.root, config.build.dir, 'fonts');

    gulp.task('material-design-icons', function () {
        console.log(destination);

        return gulp.src([path.join(config.root, 'node_modules/gulp-builder/node_modules/material-design-icons/iconfont/*')])
            .pipe(gulp.dest(destination))
    });
};

module.exports = {
    addSourcesTasks: addSourcesTasks
};