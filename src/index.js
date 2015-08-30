var _ = require('lodash');
var buildTaskGenerator = require('./tasks/build/task-generator');

var processRoot = function (root) {

    if (root && (root.length - 1) !== root.lastIndexOf('/')) {
        root = root + '/';
    }

    return root;
};

var addGulpTasks = function (gulp, config) {
    var applications;

    config = config || {};

    applications = config.applications;

    config.root = processRoot(config.root);

    if (applications) {
        _.each(applications, function (application) {
            buildTaskGenerator.addBuildTasks(gulp, config, application);
        });
    }
};

module.exports = {
    addGulpTasks: addGulpTasks,
    processRoot: processRoot
};