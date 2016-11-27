/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

angular.module('myApp.test', ['ngResource','myApp.commonservices'])
.controller('testController', ['$scope', '$resource', 'GroupsService','WorkersService', '$log', function($scope, $resource, GroupsService, WorkersService, $log){
    GroupsService.all.query(function(res){
      $log.info(res);
    });

    WorkersService.all.query(function(res){
      $log.info(res);
    });
  }]);
