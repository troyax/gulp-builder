var helper = require('./task-helper');

var addBuildTasks = function (gulp, config, application) {
    var applicationName = application.id;
    var jsBuildTaskName = applicationName + ':build-js';
    var sassBuildTaskName = applicationName + ':build-sass';
    var htmlBuildTaskName = applicationName + ':build-html';
    var applicationBuildTaskName = applicationName + ':build';

    helper.addJavaScriptBuildTask(gulp, config, application, jsBuildTaskName);
    helper.addSassBuildTask(gulp, config, application, sassBuildTaskName);
    helper.addHTMLBuildTask(gulp, config, application, htmlBuildTaskName);

    gulp.task(applicationBuildTaskName, [jsBuildTaskName, sassBuildTaskName, htmlBuildTaskName]);

    return {
        js: jsBuildTaskName,
        sass: sassBuildTaskName,
        html: htmlBuildTaskName,
        main: applicationBuildTaskName
    };
};

module.exports = {
    addBuildTasks: addBuildTasks
};