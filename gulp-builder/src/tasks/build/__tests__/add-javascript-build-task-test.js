describe('The method addJavascriptBuildTask', function () {
    var addJavascriptBuildTask = require('../add-javascript-build-task');
    var applicationMock;
    var browserify = require('browserify');
    var BrowserifyBundleMock = require('lib-test/helpers/browserify-bundle-mock');
    var browserifyBundleMock = new BrowserifyBundleMock();
    var browserSync = require('browser-sync');
    var configMock;
    var gulp = require('gulp');
    var gulpif = require('gulp-if');
    var helper = require('gulp-builder/src/tasks/build/task-helper');
    var method;
    var path = require('path');
    var reactify = require('reactify');
    var result;
    var source = require('vinyl-source-stream');

    beforeEach(function () {
        method = addJavascriptBuildTask;

        configMock = {
            root: 'ROOT_MOCK',
            build: {
                dir: 'BUILD-DIR_MOCK'
            }
        };
        applicationMock = {
            build: {
                js: {}
            }
        }
    });

    describe('when called with common parameters', function () {

        beforeEach(function () {
            path.join.reset();
            gulp.cleanTasks();
            gulp.task.reset();
            browserifyBundleMock.reset();
            browserify.reset().returns(browserifyBundleMock);
            source.reset();
            gulpif.reset();
            gulp.dest.reset();
            browserSync.reload.reset();
        });

        it('should generate the expected directories using path module and default values', function () {
            result = addJavascriptBuildTask(gulp, configMock, applicationMock, 'ID_MOCK:build-js');

            expect(path.join)
                .to.have.callCount(2)
                .calledWith(configMock.root, configMock.build.dir, '')
                .calledWith(configMock.root, '', 'index.js');
        });

        it('should generate the expected directories using path module and the provided destination', function () {
            applicationMock.destination = 'DESTINATION_MOCK';

            result = addJavascriptBuildTask(gulp, configMock, applicationMock, 'ID_MOCK:build-js');

            expect(path.join)
                .to.have.callCount(2)
                .calledWith(configMock.root, configMock.build.dir, applicationMock.destination)
                .calledWith(configMock.root, '', 'index.js');
        });

        it('should generate the expected directories using path module and the provided path', function () {
            applicationMock.path = 'PATH_MOCK';

            result = addJavascriptBuildTask(gulp, configMock, applicationMock, 'ID_MOCK:build-js');

            expect(path.join)
                .to.have.callCount(2)
                .calledWith(configMock.root, configMock.build.dir, '')
                .calledWith(configMock.root, applicationMock.path, 'index.js');
        });

        it('should generate the expected directories using path module and the provided js entry file', function () {
            applicationMock.build.js.entry = 'JS-ENTRY_MOCK';

            result = addJavascriptBuildTask(gulp, configMock, applicationMock, 'ID_MOCK:build-js');

            expect(path.join)
                .to.have.callCount(2)
                .calledWith(configMock.root, configMock.build.dir, '')
                .calledWith(configMock.root, '', applicationMock.build.js.entry);
        });

        it('should add the application build-js task', function () {
            result = addJavascriptBuildTask(gulp, configMock, applicationMock, 'ID_MOCK:build-js');

            expect(gulp.task)
                .to.have.callCount(1);
        });

        it('should call all method within the default path of execution of the task when task is executed', function () {
            result = addJavascriptBuildTask(gulp, configMock, applicationMock, 'ID_MOCK:build-js');

            gulp.executeTask('ID_MOCK:build-js');

            expect(browserify)
                .to.have.callCount(1)
                .calledWith('ROOT_MOCK/index.js');
            expect(browserifyBundleMock.pipeline.on)
                .to.have.callCount(1)
                .calledWith('file');
            expect(browserifyBundleMock.transform)
                .to.have.callCount(1)
                .calledWith(reactify);
            expect(browserifyBundleMock.bundle)
                .to.have.callCount(1);
            expect(browserifyBundleMock.on)
                .to.have.callCount(1)
                .calledWith('error');
            expect(browserifyBundleMock.pipe)
                .to.have.callCount(5);
            expect(source)
                .to.have.callCount(1)
                .calledWith('app.js');
            expect(gulpif)
                .to.have.callCount(2)
                .calledWith(undefined, 'vinyl-buffer')
                .calledWith(undefined, 'gulp-uglify');
            expect(gulp.dest)
                .to.have.callCount(1)
                .calledWith('ROOT_MOCK/BUILD-DIR_MOCK/js');
            expect(browserSync.reload)
                .to.have.callCount(1)
                .calledWith({stream: true});
        });

        it('should call source with a custom path when js rename is provided', function () {
            applicationMock.build.js.rename = 'CUSTOM_NAME.js';

            result = addJavascriptBuildTask(gulp, configMock, applicationMock, 'ID_MOCK:build-js');

            gulp.executeTask('ID_MOCK:build-js');


            expect(source)
                .to.have.callCount(1)
                .calledWith('CUSTOM_NAME.js');
        });

        it('should call gulpif with true if minify is true', function () {
            configMock.minify = true;

            result = addJavascriptBuildTask(gulp, configMock, applicationMock, 'ID_MOCK:build-js');

            gulp.executeTask('ID_MOCK:build-js');

            expect(gulpif)
                .to.have.callCount(2)
                .calledWith(true, 'vinyl-buffer')
                .calledWith(true, 'gulp-uglify');
        });
    });
});