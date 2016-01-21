var browserifyIstanbul = require('browserify-istanbul');
var isparta = require('isparta');

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: './',

    // frameworks to use
    frameworks: ['mocha', 'chai', 'browserify'],

    // list of files / patterns to load in the browser
    files: [
      'static/js/spec/**/*.spec.js'
    ],

    preprocessors: {
      'static/js/spec/**/*.spec.js': ['browserify']
    },

    browserify: {
      debug: true,
      transform: [
        browserifyIstanbul({
            instrumenter: isparta,
            ignore: ['**/spec/**']
          }),
        'babelify'
      ]
    },

    // test results reporter to use
    reporters: ['progress', 'coverage'],

    coverageReporter: {
      reporters: [
        {
          type: 'lcov'
        }, {
          type: 'text'
        }, {
          type: 'text-summary'
        }
      ]
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers
    browsers: ['PhantomJS'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    concurrency: Infinity
  });
};
