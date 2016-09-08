//TODO commonalize options with sails pipeline.js

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
      //TODO: check if on master branch of moment
      'bower_components/moment-duration-format/lib/moment-duration-format.js',
      'js/src/**/*.js',
      'js/app.js',
      'node_modules/phantomjs-polyfill/bind-polyfill.js',
      'node_modules/babel-polyfill/dist/polyfill.js'
    ],
    preprocessors:{
     // 'js/src/**/*.js':["babel"]
    },


    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    reporters: ['spec'],

    plugins : [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-spec-reporter'
          //  'karma-babel-preprocessor'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
