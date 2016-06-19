'use strict';
/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

  //TODO: is that test and others are to monolitic with those json response structs?

//var assert = require("assert");


var customMatchers = {
  toEqualData: function(util, customTester){

    return {
      compare: function(actual, expected) {
        return angular.equals(actual, expected);
      }
    }
  }
}


describe('myApp.workerview', function() {

  var $httpBackend;
  var $controller;
  var $scope = {};
  var WorkersService;
  var GroupsService;
  var configCtrl;

  beforeEach(function(){
    jasmine.addMatchers(customMatchers);
  });

  //beforeEach(module('myApp.commonservices'));
  beforeEach(module('myApp.workerview'));

  beforeEach(inject(function($injector, _$controller_, _WorkersService_, _GroupsService_){
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.when('GET', /\/workerview\/worker.*/).respond(table_data);
    $httpBackend.expectGET('/group').respond([]);

    $scope = {};

    WorkersService = _WorkersService_;
    GroupsService = _GroupsService_;
    $controller = _$controller_;

    configCtrl = $controller('workerviewController', {$scope: $scope});

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('column Data formatting', function(){

    //TODO: be sure and check if login_datetime is good to feed Data column
    //TODO: mock WorkersService to not use setting on $scope parameters to that service
    it('should be defined year,month,day in data column based on login_datetime field from request', function(){

      var from = moment('2011-08-31T12:00:00.000Z');
      var to   = moment('2015-08-31T12:00:00.000Z');

      $scope.loadData(111, 0, from, to);
      $httpBackend.flush();

      expect($scope.table).toBeDefined(); //TODO usunac jesli dziala
      expect($scope.table[0].date).toBe("2015-08-31T12:00:00.000Z");
    });

  });



  describe('column Data filter format', function() {
    var $filter;

    beforeEach(function () {
//      module('myApp.workerview');

      inject(function (_$filter_) {
        $filter = _$filter_;
      });
    });

    afterEach(function(){
      $httpBackend.flush();
    });

    //TODO: make test if timezone input data is properly displayed
    it('should show day in format 2015-08-01 if aggregation "long day" is enabled', function () {
      var opt = "long_day";
      var date = "2015-08-31T12:00:00.000Z";
      var result = $filter('dateAggregator')(date, opt);
      expect(result).toEqual('2015-08-31');
    });

    it('should show day in format 08-01 if aggregation "short day" is enabled', function () {
      var opt = "short_day";
      var date = "2015-08-31T12:00:00.000Z";
      var result = $filter('dateAggregator')(date, opt);
      expect(result).toEqual('08-31');
    });

    it('should show month in format 2015-08 if aggregation "month" is enabled', function () {
      var opt = "month";
      var date = "2015-08-31T12:00:00.000Z";
      var result = $filter('dateAggregator')(date, opt);
      expect(result).toEqual('2015-08');
    });

    it('should show month in format 2015-08 if aggregation "year" is enabled', function () {
      var opt = "year";
      var date = "2015-08-31T12:00:00.000Z";
      var result = $filter('dateAggregator')(date, opt);
      expect(result).toEqual('2015');
    });
  });


});


var table_data = [
  {
    "_id": null,
    "data": [
      {
        "_id": {
          "dayOfYear": 243
        },
        "login_datetime": "2015-08-31T12:00:00.000Z",
        "logout_datetime": "2015-08-31T18:00:00.000Z",
        "total_logged_time": 115200,
        "total_break_time": 0,
        "total_idle_time": 21600,
        "total_pro_apps_time": 115200,
        "total_nonpro_apps_time": 0,
        "total_nonidle_duration": 93600,
        "status1": 0,
        "status2": 0,
        "status3": 0,
        "status4": 0
      },
      {
        "_id": {
          "dayOfYear": 236
        },
        "login_datetime": "2015-08-24T07:00:00.000Z",
        "logout_datetime": "2015-08-24T14:00:00.000Z",
        "total_logged_time": 28800,
        "total_break_time": 0,
        "total_idle_time": 10800,
        "total_pro_apps_time": 28800,
        "total_nonpro_apps_time": 0,
        "total_nonidle_duration": 18000,
        "status1": 0,
        "status2": 0,
        "status3": 0,
        "status4": 0
      },
      {
        "_id": {
          "dayOfYear": 227
        },
        "login_datetime": "2015-08-15T07:00:00.000Z",
        "logout_datetime": "2015-08-15T14:00:00.000Z",
        "total_logged_time": 28800,
        "total_break_time": 0,
        "total_idle_time": 3600,
        "total_pro_apps_time": 28800,
        "total_nonpro_apps_time": 0,
        "total_nonidle_duration": 25200,
        "status1": 0,
        "status2": 0,
        "status3": 0,
        "status4": 0
      },
      {
        "_id": {
          "dayOfYear": 226
        },
        "login_datetime": "2015-08-14T07:00:00.000Z",
        "logout_datetime": "2015-08-14T14:00:00.000Z",
        "total_logged_time": 28800,
        "total_break_time": 0,
        "total_idle_time": 3600,
        "total_pro_apps_time": 28800,
        "total_nonpro_apps_time": 0,
        "total_nonidle_duration": 25200,
        "status1": 0,
        "status2": 0,
        "status3": 0,
        "status4": 0
      },
      {
        "_id": {
          "dayOfYear": 225
        },
        "login_datetime": "2015-08-13T07:00:00.000Z",
        "logout_datetime": "2015-08-13T13:00:00.000Z",
        "total_logged_time": 25200,
        "total_break_time": 0,
        "total_idle_time": 0,
        "total_pro_apps_time": 25200,
        "total_nonpro_apps_time": 0,
        "total_nonidle_duration": 25200,
        "status1": 0,
        "status2": 0,
        "status3": 0,
        "status4": 0
      },
      {
        "_id": {
          "dayOfYear": 224
        },
        "login_datetime": "2015-08-12T07:00:00.000Z",
        "logout_datetime": "2015-08-12T13:00:00.000Z",
        "total_logged_time": 25200,
        "total_break_time": 0,
        "total_idle_time": 0,
        "total_pro_apps_time": 25200,
        "total_nonpro_apps_time": 0,
        "total_nonidle_duration": 25200,
        "status1": 0,
        "status2": 0,
        "status3": 0,
        "status4": 0
      }
    ]
  }
];
