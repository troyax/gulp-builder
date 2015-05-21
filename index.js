var Builder = {
    plugins: require('./src/plugins.js')
};

Builder.getTask = function (task, gulp, options, data) {
    return require(__dirname + "/src/tasks/" + task)(gulp, this.plugins, options, data);
};

Builder.processOptions = function (options) {

};

module.exports = Builder;
