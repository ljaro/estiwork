module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/**/angular-resource.js',
      'bower_components/**/ui-grid.js',
	  'bower_components/**/moment-with-locales.js',
	  'js/src/**/*.js',
      'js/app.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],
	
	reporters: ['spec'],

    plugins : [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-spec-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
