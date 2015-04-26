var Builder = {
    plugins: require('./src/plugins.js')
};

Builder.getTask = function (task, gulp, options) {
    return require(__dirname + "/src/tasks/" + task)(gulp, this.plugins, options);
};

Builder.processOptions = function (options) {

};

module.exports = Builder;
