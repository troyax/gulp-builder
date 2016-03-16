describe('The Gulp Builder', function () {
    var builder = require('../index');
    var buildTaskGeneratorMock = require('gulp-builder/src/tasks/build/task-generator');
    var callbackMock = 'CALLBACK_MOCK';
    var configMock;
    var gulp = require('gulp');
    var result;
    var runSequence = require('run-sequence');

    beforeEach(function () {
        configMock = {
            root: '/home/dev/my-project',
            build: {
                dir: 'BUILD-DIR_MOCK'
            }
        };

        buildTaskGeneratorMock.addBuildTasks.reset().returns({
            main: 'index:build',
            js: 'index:build-js',
            sass: 'index:build-sass',
            html: 'index:build-html'
        });
        gulp.task.reset();
        runSequence.reset();
    });

    describe('when processRoot method is called', function () {

        it('should return providedValue if providedValue is falsy', function () {
            result = builder.processRoot();

            expect(result).to.equal(undefined);
        });

        it('should return providedValue if providedValue has / on the last character', function () {
            result = builder.processRoot('/home/dev/my-project/');

            expect(result).to.equal('/home/dev/my-project/');
        });

        it('should return providedValue + / if providedValue has not / on the last character', function () {
            result = builder.processRoot('/home/dev/my-project');

            expect(result).to.equal('/home/dev/my-project/');
        });
    });

    describe('when addGulpTask method is called', function () {
        var processRootStub = stub().returns('/home/dev/my-project/');

        beforeEach(function () {
            builder.__set__({processRoot: processRootStub});
        });

        afterEach(function () {
            processRootStub.reset();
            buildTaskGeneratorMock.addBuildTasks.reset();
        });

        it('should call processRoot once', function () {
            configMock = {
                root: '/home/dev/my-project',
                build: {
                    dir: 'BUILD-DIR_MOCK'
                }
            };

            builder.addGulpTasks(gulp, configMock);

            expect(processRootStub).to.have.callCount(1);
        });


        it('should not call addBuildTasks if no applications are provided on the config object', function () {
            builder.addGulpTasks(gulp, configMock);

            expect(buildTaskGeneratorMock.addBuildTasks)
                .to.have.callCount(0);
        });

        it('should call addBuildTasks once if one applications is provided on the config object', function () {
            configMock.applications = {
                'index': {
                    id: 'index',
                    path: 'application-index/',
                    build: {
                        js: {
                            entry: 'index.js',
                            rename: 'app.js'
                        },
                        sass: {
                            rename: 'style.css'
                        },
                        html: {
                            entry: 'html/index.html',
                            rename: 'index.html'
                        }
                    }
                }
            };

            builder.addGulpTasks(gulp, configMock);

            expect(buildTaskGeneratorMock.addBuildTasks)
                .to.have.callCount(1)
                .calledWith(gulp, configMock, configMock.applications['index']);
        });

        it('should call addBuildTasks twice if two applications are provided on the config object', function () {
            configMock.applications = {
                'index': {
                    id: 'index',
                    path: 'application-index/',
                    build: {
                        js: {
                            entry: 'index.js',
                            rename: 'app.js'
                        },
                        sass: {
                            rename: 'style.css'
                        },
                        html: {
                            entry: 'html/index.html',
                            rename: 'index.html'
                        }
                    }
                },
                'demo': {
                    id: 'demo',
                    path: 'application-demo/',
                    destination: 'demo/',
                    build: {
                        js: {
                            entry: 'index.js',
                            rename: 'app.js'
                        },
                        sass: {
                            entry: 'index',
                            rename: 'style.css'
                        },
                        html: {
                            entry: 'html/index.html',
                            rename: 'index.html'
                        }
                    }
                }
            };

            builder.addGulpTasks(gulp, configMock);

            expect(buildTaskGeneratorMock.addBuildTasks)
                .to.have.callCount(2)
                .calledWith(gulp, configMock, configMock.applications['index'])
                .calledWith(gulp, configMock, configMock.applications['demo']);
        });

        xit('should call addBuildTasks with gulp, config, application every time addBuildTasks is called', function () {
            configMock = {
                root: '/home/dev/my-project',
                applications: {
                    'application-1': true,
                    'application-2': true
                }
            };

            builder.addGulpTasks(gulpMock, configMock);

            expect(buildTaskGeneratorMock.addBuildTasks).to.have.been.calledWith(gulpMock, configMock, configMock.applications['application-1']);
            expect(buildTaskGeneratorMock.addBuildTasks).to.have.been.calledWith(gulpMock, configMock, configMock.applications['application-2']);
        });

        it('should add default task to gulp', function () {
            configMock.applications = {
                'index': {
                    id: 'index',
                    path: 'application-index/',
                    build: {
                        js: {
                            entry: 'index.js',
                            rename: 'app.js'
                        },
                        sass: {
                            rename: 'style.css'
                        },
                        html: {
                            entry: 'html/index.html',
                            rename: 'index.html'
                        }
                    }
                }
            };

            builder.addGulpTasks(gulp, configMock);

            gulp.executeTask('default', [callbackMock]);

            expect(gulp.task)
                .to.have.callCount(1)
                .calledWith('default');
            expect(runSequence)
                .to.have.callCount(1)
                .calledWith(['index:build'], 'browser-sync', callbackMock);
        });

    });
});