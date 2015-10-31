'use strict';

/**
 * Created by luk on 2015-08-22.
 */


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

describe('myApp.historyview', function() {

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
  beforeEach(module('myApp.historyview'));

  beforeEach(inject(function($injector, _$controller_){
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    //$httpBackend.when('GET', '/worker').respond(fakeResponse_worker_all);
    //$httpBackend.when('GET', '/group').respond([]);

    $scope = {};

    $controller = _$controller_;

    configCtrl = $controller('historyviewController', {$scope: $scope});

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('controller on start', function(){

  });

});
