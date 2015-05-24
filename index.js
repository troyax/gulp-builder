var Builder = {
    plugins: require('./src/plugins.js')
};

Builder.getTask = function (task, options, data) {
    return require(__dirname + "/src/tasks/" + task)(this.plugins.gulp, this.plugins, options, data);
};

Builder.processOptions = function (options) {

};

module.exports = Builder;
