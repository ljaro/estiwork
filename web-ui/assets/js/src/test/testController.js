/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
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
