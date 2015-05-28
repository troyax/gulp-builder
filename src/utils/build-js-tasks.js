module.exports = function (gulp, options, data, builder) {
    var fs = require('fs');
    var task = builder.getTask;

    var modules = fs.readdirSync(options.modules.root);
    var buildTasks = {js: [], sass: [], html: []};

    for(var index = 0; index < modules.length; index++) {
        var currentModule = modules[index];
        var jsBuildTaskName = 'js-' + currentModule + '-build';
        var sassBuildTaskName = 'sass-' + currentModule + '-build';
        var htmlBuildTaskName = 'html-' + currentModule + '-build';

        data = {
            module: currentModule,
            htmlTemplateData: {}
        };

        gulp.task(jsBuildTaskName, task('js-module-build', options, data) );
        gulp.task(sassBuildTaskName, task('sass-module-build', options, data) );
        gulp.task(htmlBuildTaskName, task('html-module-build', options, data) );

        buildTasks.js.push(jsBuildTaskName);
        buildTasks.sass.push(sassBuildTaskName);
        buildTasks.html.push(htmlBuildTaskName);
    };

    return {
        buildTasks: buildTasks,
        modules: modules
    };
};