const glob = require('glob');
module.exports = function(grunt) {
  const srcJS = './static/js/src/**/*.js';
  const libJS = './static/js/lib/**/*.js';
  const testJS = './static/tests/**/*Spec.js';
  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),
    clean: {
      tests: ['./static/tests/bin/*']
    },
    watch: {
      less: {
        files: ['./static/css/**/*.less'],
        tasks: ['less:dist']
      },
      js: {
        files: [srcJS, libJS],
        tasks: ['uglifyAMD:js']
      },
      test: {
        files: [srcJS, libJS, testJS],
        tasks: ['uglifyAMD:test', 'karma:client']
      }
    },
    jshint: {
      src: [srcJS],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    jscs: {
      src: [srcJS],
      options: {
        config: '.jscsrc',
        verbose: true
      }
    },
    uglifyAMD: {
      js: {
        options: {
          sourceMap: true,
          compress: {},
          beautify: false,
          pattern: srcJS
        },
        files: {
          './static/js/p4.js': ['./static/js/lib/mustache.js', './static/js/src/main.js']
        }
      },
      test: {
        options: {
          sourceMap: true,
          compress: false,
          beautify: true,
          mangle: false,
          pattern: [srcJS, testJS]
        },
        files: {
          './static/tests/bin/p4.js': ['./static/js/lib/mustache.js'].concat(glob.sync(testJS))
        }
      }
    },
    less: {
      dist: {
        files: {
          './static/css/p4.css': './static/css/default.less'
        },
        options: {
          compress: true
        }
      }
    },
    karma: {
      client: {
        configFile: './static/tests/config/karma.conf.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-uglify-amd');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('lint', [
    'jshint',
    'jscs'
  ]);
  grunt.registerTask('test', [
    'clean',
    'uglifyAMD:test',
    'karma:client'
  ]);
  grunt.registerTask('build', [
    'lint',
    'test',
    'less',
    'uglifyAMD:js'
  ]);
};
