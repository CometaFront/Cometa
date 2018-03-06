/* eslint no-nested-ternary: 0 */

require('dotenv').load();
module.exports = (grunt) => {
  grunt.initConfig({
    nodemon: {
      dev: {
        script: 'app/index.js',
        options: {
          callback: (nodemon) => {
            process.stdout.write('\n\r');
            nodemon.on('log', (event) => {
              process.stdout.write(`  ${event.colour}\n\r`);
            });
          },
          env: {
            NODE_ENV: grunt.option('env') || 'local',
            PORT: process.env.PORT
          },
          cwd: __dirname,
          ignore: ['node_modules/**'],
          ext: 'js',
          delay: 200
        }
      }
    },
    eslint: {
      target: [
        './app/**/*.js',
        './test/**/*.js'
      ],
      options: { quiet: true }
    }
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('lint', ['eslint']);
};
