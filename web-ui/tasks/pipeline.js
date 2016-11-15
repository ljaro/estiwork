/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */



// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
  //'bower_components/bootstrap/dist/css/bootstrap.css',
  //'bower_components/bootswatch/paper/bootstrap.css',
  'bower_components/angular-ui-grid/ui-grid.css',
  'js/dependencies/bootstrap-datepicker-release/css/datepicker3.css',
  //'bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css',
  'bower_components/bootstrap-daterangepicker/daterangepicker.css',
  'bower_components/**/isteven-multi-select.css',
  'styles/**/importer.css',
  'styles/**/junk.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

  // Load sails.io before everything else
  'js/dependencies/sails.io.js',


  // Dependencies like jQuery, or Angular are brought in here

  'bower_components/jquery/dist/jquery.min.js',
  'bower_components/moment/min/moment-with-locales.js',

  //TODO: check if on master branch of moment
  'bower_components/moment-duration-format/lib/moment-duration-format.js',

  'bower_components/bootstrap/dist/js/bootstrap.js',
  'bower_components/angular/angular.js',
  'bower_components/angular-mocks/angular-mocks.js',
  'bower_components/angular-route/angular-route.js',
  'bower_components/angular-ui-router/release/angular-ui-router.js',
  'bower_components/angular-resource/angular-resource.js',

  'bower_components/angular-translate/angular-translate.min.js',
  'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',

  'bower_components/angular-logger/dist/angular-logger.min.js',

  'bower_components/**/ui-bootstrap-tpls.js',

  'bower_components/angular-ui-grid/ui-grid.js',
  'bower_components/angular-smart-table/dist/smart-table.js',

  //'bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.js',
  //'bower_components/bootstrap-datepicker/dist/locales/bootstrap-datepicker.pl.js',
  'js/dependencies/bootstrap-datepicker-release/js/bootstrap-datepicker.js',
  'js/dependencies/bootstrap-datepicker-release/js/locales/bootstrap-datepicker.pl.js',
  'bower_components/bootstrap-daterangepicker/daterangepicker.js',
  'bower_components/angular-daterangepicker/js/angular-daterangepicker.js',

  'bower_components/angular-multi-select/isteven-multi-select.js',

  'js/dependencies/*.js',
  // All of the rest of your client-side js files
  // will be injected here in no particular order.
  'js/app.js',
  'js/src/**/*.js',
  '!js/src/**/*.test.js'
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  'templates/**/*.html'
];


addPathPrefix = function(prefix, path){
	if(path.substring(0,1) == '!')
	{
		return '!' + prefix + path.substring(1,path.length);
	}
	else
	{
		return prefix + path;
	}
}
// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(path) {
  return addPathPrefix('.tmp/public/', path);
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(path) {
  return 'assets/' + path;
});
