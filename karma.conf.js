var aliases = require('./package.json').aliasify.aliases;
var dirnameRegExp = new RegExp(__dirname);
var coverageifyConfig = {
    ignores: [
        /\.json$/,
        /__tests__/,
        /__mocks__/
    ],
    contains: [
        dirnameRegExp
    ]
};

var lodash = require('lodash');
var fs = require('fs');
var path = require('path');
var matches = require('validator').matches;

process.env.NODE_PATH = __dirname;

var searchForMocks = function (shouldUseDirectoryOnly, rootPath, mocks, pattern, directory) {
    var directories;
    var originalPath;
    var directoryPath = path.join(rootPath, directory);
    var directoryStat;

    try {
        directoryStat = fs.statSync(directoryPath);

        if (directoryStat.isFile()) {

            if (matches(directoryPath, pattern)) {
                originalPath = directory;

                if (!shouldUseDirectoryOnly) {
                    originalPath = directoryPath.replace('__mocks__/', '');
                }

                originalPath = originalPath.replace('-mock.js', '');

                mocks[originalPath] = directoryPath.replace('.js', '');
            }
        } else if (directoryStat.isDirectory()) {
            directories = fs.readdirSync(directoryPath);

            lodash.forEach(directories, searchForMocks.bind(this, shouldUseDirectoryOnly, directoryPath, mocks, pattern));
        }

    } catch (error) {}
};

var aliasifyModules = function (config) {
    var directories = config['directories'];
    var mocks = config['aliases'];
    var mockFilePattern = config['mockFilePattern'];
    var modulesToMock = config['modules'];

    lodash.forEach(directories, searchForMocks.bind(this, false, '', mocks, mockFilePattern));

    if (lodash.isString(modulesToMock)) {
        lodash.forEach([modulesToMock], searchForMocks.bind(this, true, '', mocks, mockFilePattern));
    } else {
        lodash.extend(mocks, modulesToMock);
    }
};

module.exports = function(config) {
    aliasifyModules({
        directories: [
            'gulp-builder/src'
        ],
        modules: 'lib-test/modules-mocks',
        mockFilePattern: '-mock.js',
        aliases: aliases
    });

    config.set({

        basePath: './',

        frameworks: ['browserify', 'mocha'],

        files: [
            'node_modules/react-tools/src/test/phantomjs-shims.js',
            'lib-test/global.js',
            'gulp-builder/src/**/__tests__/*.js'
        ],

        preprocessors: {
            'lib-test/global.js': [ 'browserify' ],
            'gulp-builder/src/**/__tests__/*.js': [ 'browserify' ]
        },

        browserify: {
            debug: true,
            transform: [ ['coverageify', coverageifyConfig], [ 'rewireify' ], 'aliasify' ]
        },

        browsers : ['PhantomJS'],

        reporters: ['progress', 'coverage'],

        coverageReporter : {
            dir: 'test-coverage',
            reporters: [
                {type: 'html', subdir: 'html'},
                {type: 'cobertura', subdir: 'cobertura'}
            ]
        },

        logLevel: config.LOG_ERROR,

        singleRun: false,

        autoWatch: true

    });
};