/**
 * Created by luk on 2015-08-26.
 */
angular.module('myApp.test', ['ngResource','myApp.commonservices'])
.controller('testController', ['$scope', '$resource', 'GroupsService','WorkersService', function($scope, $resource, GroupsService, WorkersService){
    GroupsService.all.query(function(res){
      console.log(res);
    });

    WorkersService.all.query(function(res){
      console.log(res);
    });
  }]);
