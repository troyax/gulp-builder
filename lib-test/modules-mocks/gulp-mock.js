module.exports = {
    dest: stub(),
    tasks: {},
    task: spy(function (taskName, callback) {
        this.tasks[taskName] = callback;
    }),

    cleanTasks: function () {
        this.tasks = {};
    },
    executeTask: function (taskName, parameters) {
        this.tasks[taskName].apply(this, parameters);
    }
};