/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

angular.module('myApp', [
  'mypopover',
  'myApp.utils',
  'myApp.test',
  'myApp.commonservices',
  'myApp.workerselect',
  'myApp.checklistModule',
  'myApp.configuration',
  'myApp.quickview',
  'myApp.historyview',
  'myApp.workerview',
  'myApp.reportview',
  'myApp.navbar',
  'myApp.calendarModule',
  'myApp.tableexModule',
  'myApp.myFilters',
  'myApp.testgen',
  'myApp.blinky',
  'myApp.feedback',
  'ui.bootstrap',
  'ui.router',
  'ui.grid',
  'ui.grid.resizeColumns',
  'ui.grid.edit',
  'ui.grid.cellNav',
  //'daterangepicker',
  'isteven-multi-select',
  'smart-table',
  // 'ui.bootstrap.datetimepicker',
  'ngResource',
  'pascalprecht.translate'])


  .config(function($stateProvider, $urlRouterProvider, $translateProvider, $translatePartialLoaderProvider) {
    //
    // For any unmatched url, redirect to /state1
    //$urlRouterProvider.otherwise("/quickview");
    //
    console.log('Route start config');
    // Now set up the states
    $stateProvider
      .state('quickview', {
        url: "/quickview",
        templateUrl: "js/src/quickview/quickview.html",
        controller: 'quickViewController'
      })
      .state('history', {
        url: "/history",
        templateUrl: "js/src/historyview/historyview.html",
        controller: 'historyviewController'
      })
      .state('worker', {
        url: "/worker",
        templateUrl: "js/src/workerview/workerview.html",
        controller: 'workerviewController'
      })
      .state('reports', {
        url: "/reports",
        templateUrl: "js/src/reportview/reportview.html",
        controller: 'reportviewController'
      })
      .state('configuration', {
        url: "/configuration",
        templateUrl: "js/src/configuration/configuration.html",
        controller: 'configurationController'
      }).state('testgen', {
        url: "/testgen",
        templateUrl: "js/src/tools/testgen.html",
        controller: 'testgenController'
      }).state('test', {
        url: "/test",
        templateUrl: "js/src/test/test.html",
        controller: 'testController'
      });

      $translateProvider.useStaticFilesLoader({
        prefix: '/language/locale-',
        suffix: '.json'
      })
      .preferredLanguage('pl')
      .useMissingTranslationHandlerLog()
  });
