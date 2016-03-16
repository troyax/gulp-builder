describe('The taskGenerator', function () {
    var applicationMock;
    var configMock;
    var gulp = require('gulp');
    var helper = require('gulp-builder/src/tasks/build/task-helper');
    var method;
    var result;
    var runSequence = require('run-sequence');
    var taskGenerator = require('../task-generator');

    describe('when addBuildTasks method is called', function () {
        var callbackMock;

        beforeEach(function () {
            method = taskGenerator.addBuildTasks;

            callbackMock = 'CALLBACK_MOCK';
        });

        describe('and called with an application object', function () {

            beforeEach(function () {
                applicationMock = {
                    id: 'ID_MOCK'
                };

                helper.addJavaScriptBuildTask.reset();
                helper.addSassBuildTask.reset();
                helper.addHTMLBuildTask.reset();
                gulp.task.reset();
                runSequence.reset();
            });

            it('should add all JavaScript, SASS and HTML tasks', function () {
                result = method(gulp, configMock, applicationMock);

                expect(helper.addJavaScriptBuildTask)
                    .to.have.callCount(1)
                    .calledWith(gulp, configMock, applicationMock, 'ID_MOCK:build-js');
                expect(helper.addSassBuildTask)
                    .to.have.callCount(1)
                    .calledWith(gulp, configMock, applicationMock, 'ID_MOCK:build-sass');
                expect(helper.addHTMLBuildTask)
                    .to.have.callCount(1)
                    .calledWith(gulp, configMock, applicationMock, 'ID_MOCK:build-html');
            });

            it('should add the application build task and call run-sequence with the expected tasks', function () {
                result = method(gulp, configMock, applicationMock);

                expect(gulp.task)
                    .to.have.callCount(1)
                    .calledWithMatch('ID_MOCK:build');

                gulp.executeTask('ID_MOCK:build', [callbackMock]);

                expect(runSequence)
                    .to.have.callCount(1)
                    .calledWithMatch('ID_MOCK:build-js', 'ID_MOCK:build-sass', 'ID_MOCK:build-html', callbackMock);

                gulp.cleanTasks();
            });
        });
    });
});