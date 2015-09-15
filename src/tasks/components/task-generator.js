var babel = require('gulp-babel');
var concat = require('gulp-concat');

var addComponentsBuildTasks = function (gulp, config, components) {
    var componentsDirectory = config.root + components.directory;
    var componentsBuildDestination = config.root + components.destination;

    gulp.task('components:build-js', function () {
        return gulp.src([componentsDirectory + '*.js', componentsDirectory + '*.jsx'])
            .pipe(babel())
            .pipe(gulp.dest(componentsBuildDestination))
    });

    gulp.task('components:build-scss', function () {
        var bundle = gulp.src([componentsDirectory + '*.scss']).pipe(concat('components.scss')).on('error', function (error) {
            console.log(error);
            this.emit('end')
        });

        return bundle.pipe(gulp.dest(componentsBuildDestination));
    });
};

module.exports = {
    addComponentsBuildTasks: addComponentsBuildTasks
};