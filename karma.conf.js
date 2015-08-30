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

module.exports = function(config) {
    config.set({

        basePath: './',

        frameworks: ['browserify', 'mocha'],

        files: [
            'lib-test/global.js',
            'src/**/__tests__/*.js'
        ],

        preprocessors: {
            'lib-test/global.js': [ 'browserify' ],
            'src/**/__tests__/*.js': [ 'browserify' ]
        },

        browserify: {
            debug: true,
            transform: [ ['coverageify', coverageifyConfig], [ 'rewireify' ] ]
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