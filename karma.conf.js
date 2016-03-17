var aliases = require('./package.json').aliasify.aliases;
var aliasifyMocks = require('aliasify-mocks');
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

process.env.NODE_PATH = __dirname;

module.exports = function(config) {
    aliasifyMocks({
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