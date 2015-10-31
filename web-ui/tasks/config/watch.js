/**
 * Run predefined tasks whenever watched file patterns are added, changed or deleted.
 *
 * ---------------------------------------------------------------
 *
 * Watch for changes on
 * - files in the `assets` folder
 * - the `tasks/pipeline.js` file
 * and re-run the appropriate tasks.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-watch
 *
 */
module.exports = function(grunt) {


	grunt.config.set('watch', {
		api: {

			// API files to watch:
			files: ['api/**/*', '!**/node_modules/**'],
      options: {
        interval: 1000
      }
		},
		assets: {

			// Assets to watch:
			files: ['assets/**/*', 'tasks/pipeline.js', '!**/node_modules/**', '!**/bower_components/**'],

			// When assets are changed:
			tasks: ['syncAssets' , 'linkAssets', 'beep'],

      options: {
        interval: 1000
      }
		}
	});

	grunt.event.on('watch', function(action, filepath, target) {
		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});

  grunt.loadNpmTasks('grunt-beep');
	grunt.loadNpmTasks('grunt-contrib-watch');
};
