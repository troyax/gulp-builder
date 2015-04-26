module.exports = function (gulp, plugins, options) {
    return function (callback) {
        plugins.del(options.target + options.sass.destination);

        plugins._.forIn(options.applications, function (application, index) {
            var path = options.target + application.folder;

            plugins.del(path + application.build.js);
        });

        callback();
    };
};