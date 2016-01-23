/*
*   Module:   Gruntfile.js
*   Author:   Richard Gieg
*
*   This file contains Grunt task definitions that optimize the website's
*   source code. Whenever the source code is modified, or if you haven't built
*   the site for the first time yet, these jobs must be executed by running
*   'grunt' in the terminal.
*
*/

module.exports = function(grunt) {

  grunt.initConfig({

    // Clear out the dist directory if it exists
    clean: {
      main: {
        src: ['dist'],
      },
    },

    // Minify HTML files, including inline JavaScript and CSS
    htmlmin: {
      main: {
        options: {
          minifyJS: true,
          minifyCSS: true,
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: 'src',
          src: '**/*.html',
          dest: 'dist',
        }]
      }
    },

    // Minify JavaScript files
    uglify: {
      main: {
        options: {
          sourceMap: false,
        },
        files: [{
          expand: true,
          cwd: 'src',
          src: '**/*.js',
          dest: 'dist',
        }]
      }
    },

    // Minify CSS files
    cssmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src',
          src: '**/*.css',
          dest: 'dist',
        }]
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('default', ['clean', 'htmlmin', 'uglify', 'cssmin']);

};
