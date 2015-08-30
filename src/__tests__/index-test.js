describe('The Gulp Builder', function () {
    var builder = require('../index');
    var gulpMock;
    var configMock;
    var buildTaskGeneratorMock = require('../tasks/build/__mocks__/task-generator-mock');

    beforeEach(function () {
        builder.__set__({buildTaskGenerator: buildTaskGeneratorMock});
    });

    describe('when processRoot method is called', function () {

        it('should return providedValue if providedValue is falsy', function () {
            var providedValue = null;

            expect(builder.processRoot(providedValue)).to.equal(providedValue);
        });

        it('should return providedValue if providedValue has / on the last character', function () {
            var providedValue = '/home/dev/my-project/';

            expect(builder.processRoot(providedValue)).to.equal(providedValue);
        });

        it('should return providedValue + / if providedValue has not / on the last character', function () {
            var providedValue = '/home/dev/my-project';

            expect(builder.processRoot(providedValue)).to.equal(providedValue + '/');
        });
    });

    describe('when addGulpTask method is called', function () {
        var processRootStub = stub().returns('/home/dev/my-project/');
        gulpMock = {
            task: stub()
        };

        beforeEach(function () {
            builder.__set__({processRoot: processRootStub});
        });

        afterEach(function () {
            processRootStub.reset();
            buildTaskGeneratorMock.addBuildTasks.reset();
        });

        it('should call processRoot once', function () {
            configMock = {root: '/home/dev/my-project'};

            builder.addGulpTasks(gulpMock, configMock);

            expect(processRootStub).to.have.callCount(1);
        });

        it('should not call addBuildTasks if no applications are provided on the config object', function () {
            configMock = {root: '/home/dev/my-project'};

            builder.addGulpTasks(gulpMock, configMock);

            expect(buildTaskGeneratorMock.addBuildTasks).to.have.callCount(0);
        });

        it('should call addBuildTasks once if one applications is provided on the config object', function () {
            configMock = {
                root: '/home/dev/my-project',
                applications: {
                    'application-1': true
                }
            };

            builder.addGulpTasks(gulpMock, configMock);

            expect(buildTaskGeneratorMock.addBuildTasks).to.have.callCount(1);
        });

        it('should call addBuildTasks twice if two applications are provided on the config object', function () {
            configMock = {
                root: '/home/dev/my-project',
                applications: {
                    'application-1': true,
                    'application-2': true
                }
            };

            builder.addGulpTasks(gulpMock, configMock);

            expect(buildTaskGeneratorMock.addBuildTasks).to.have.callCount(2);
        });

        it('should call addBuildTasks with gulp, config, application every time addBuildTasks is called', function () {
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

    });
});