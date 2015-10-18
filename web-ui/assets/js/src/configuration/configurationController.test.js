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

var fakeResponse_worker_all = [
  {
    "id": "55d995acaa18a16414b91d40",
    "login": "sdlpfsldpfsd",
    "fullname": "Person 5",
    "parent": null,
    "createdAt": "2015-08-23T09:43:08.462Z",
    "updatedAt": "2015-08-23T09:43:08.535Z"
  },
  {
    "id": "55d8e61aaa18a16414b91d3c",
    "login": "sdlpfsldpfsd",
    "fullname": "Person 1",
    "parent": null,
    "createdAt": "2015-08-22T21:14:02.663Z",
    "updatedAt": "2015-08-22T21:14:02.732Z"
  },
  {
    "id": "55d9953caa18a16414b91d3d",
    "login": "sdlpfsldpfsd",
    "fullname": "Person 2",
    "parent": null,
    "createdAt": "2015-08-23T09:41:16.206Z",
    "updatedAt": "2015-08-23T09:41:16.281Z"
  },
  {
    "id": "55d9953faa18a16414b91d3e",
    "login": "sdlpfsldpfsd",
    "fullname": "Person 3",
    "parent": null,
    "createdAt": "2015-08-23T09:41:19.168Z",
    "updatedAt": "2015-08-23T09:41:19.237Z"
  },
  {
    "id": "55d995a4aa18a16414b91d3f",
    "login": "sdlpfsldpfsd",
    "fullname": "Person 4",
    "parent": null,
    "createdAt": "2015-08-23T09:43:00.695Z",
    "updatedAt": "2015-08-23T09:43:00.887Z"
  }
];


describe('myApp.configuration', function() {

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
  beforeEach(module('myApp.configuration'));

  beforeEach(inject(function($injector, _$controller_, _WorkersService_,_GroupsService_){
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', '/worker').respond(fakeResponse_worker_all);
    $httpBackend.when('GET', '/group').respond([]);

    $scope = {};

    WorkersService = _WorkersService_;
    GroupsService = _GroupsService_;
    $controller = _$controller_;

    configCtrl = $controller('configurationController', {$scope: $scope});

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('controller on start', function(){

    it('should have $scope.workers populated', function(){
      $httpBackend.expectGET('/group').respond([{test:1},{test:2}]);
      expect($scope.workers).toBeUndefined();
      expect($scope.groups).toBeUndefined();
      $httpBackend.flush();
      expect(angular.equals($scope.workers, fakeResponse_worker_all)).toBe(true);
      expect(angular.equals($scope.groups, [{test:1},{test:2}])).toBe(true);
    });

    it('should request /worker and /group on start', function(){
      $httpBackend.expectGET('/group').respond([]);
      $httpBackend.expectGET('/worker').respond([]);
      $httpBackend.flush();
    })

    it('should have $scope.changes empty', function(){
      expect($scope.changes).toEqual({});
      $httpBackend.flush();
    });

    it('should have $scope.gridOptions.onRegisterApi set', function(){
      expect($scope.gridOptions.onRegisterApi).toBeDefined();
      $httpBackend.flush();
    });
  });

  // do we need controller initial setup i.e GET /worker/all
  describe('addData', function(){


    beforeEach(function(){
      //$httpBackend.when('POST', '/worker').respond(200, {});
    });

    it("should send POST /worker request", function () {
      $httpBackend.flush();
      $httpBackend.expect('POST', '/worker').respond(201, {});
      $httpBackend.when('POST', '/worker').respond(201, {});

      $scope.addData();
      $httpBackend.flush();
    });

    it('should add new empty entry to $scope.workers', function() {
      $httpBackend.flush();
      $httpBackend.when('POST', '/worker').respond(200, {});
      var lenBeforeAdd = $scope.workers.length;

      $scope.addData();
      expect(lenBeforeAdd).toBeLessThan($scope.workers.length);

      $httpBackend.flush();
    });

    it('should update entry in $scope.workers to have id from response', function() {
      $httpBackend.flush();
      // id in response not _id because waterline return id as response
      $httpBackend.when('POST', '/worker').respond(201, {"id": 12345});

      // $scope.workers have _id defined in all entries
      angular.forEach($scope.workers, function(itm){
        expect(itm.id).toBeDefined();
      });

      // $scope.workers doesn't have id on new entry
      $scope.addData(); // new entry add here
      var undefinedIds = 0;
      angular.forEach($scope.workers, function(itm){
        if(itm.hasOwnProperty('id') == false || itm.id == 0 || itm.id == null) undefinedIds++;
      });
      expect(undefinedIds).toEqual(1);

      // $scope.workers have id from POST response on new entry
      $httpBackend.flush();
      var itmId = 0;
      angular.forEach($scope.workers, function(itm){
        if(itm.id == 12345) {
          itmId = itm.id;
        }
      });
      expect(itmId).toEqual(12345);
    });

  });


  describe("update entry", function () {

    beforeEach(function () {
      $httpBackend.flush();
    });

    it("should update login column", function () {

    });

    it("should update parent column", function () {
    });
  });
});
