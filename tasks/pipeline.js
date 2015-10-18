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
  'bower_components/**/dist/css/bootstrap.css',
  'bower_components/**/ui-grid.css',
  'js/dependencies/bootstrap-datepicker-release/css/datepicker3.css',
  //'js/dependencies/angular-multi-select/angular-multi-select.css',
  'bower_components/**/isteven-multi-select.css',
  'styles/**/*.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

  // Load sails.io before everything else
  'js/dependencies/sails.io.js',


  // Dependencies like jQuery, or Angular are brought in here

  'bower_components/**/jquery.min.js',
  'bower_components/moment/min/moment-with-locales.js',
  'bower_components/**/dist/js/bootstrap.js',
  'bower_components/**/angular.js',
  'bower_components/**/angular-mocks.js',
  'bower_components/**/angular-route.js',
  'bower_components/**/angular-ui-router.js',
  'bower_components/**/angular-resource.js',

  'bower_components/**/ui-bootstrap-tpls.js',

  'bower_components/**/ui-grid.js',

  'js/dependencies/bootstrap-datepicker-release/js/bootstrap-datepicker.js',
  'js/dependencies/bootstrap-datepicker-release/js/locales/bootstrap-datepicker.pl.js',
  //'js/dependencies/angular-multi-select/angular-multi-select.js',
  'bower_components/**/isteven-multi-select.js',

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
