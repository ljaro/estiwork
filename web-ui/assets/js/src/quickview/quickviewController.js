/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

angular.module('myApp.quickview')

  .controller('quickViewController',
    ['$scope', '$resource', '$interval', 'GroupsService', 'Utils',
      function ($scope, $resource, $interval, GroupsService, Utils) {

        $scope.groupSelections = [];
        $scope.flatGroups = [];

        $scope.filterSelection = function (x) {
          var res = $scope.flatGroups.find(function (xx) {
            return xx.id === x && xx.ticked;
          });
          return res !== undefined;
        }

        GroupsService.all.query(function (data) {
          $scope.flatGroups = Utils.flatGroups(data);
        });
        
        function startPulling() {
          $interval(function () {
            $scope.loadData($scope.groupSelections);
          }, 2000, false);
        }

        $scope.loadData = function (groups) {

          if (typeof groups === 'undefined') {
            $scope.groups = null;
            return;
          }

          var groupsIds = groups.map(function (x) {
            return x.id;
          });

          if (typeof groupsIds === 'undefined' || groupsIds.length == 0) {
            $scope.groups = null;
            return;
          }

          $resource('/quickview/group/:id').query({id: groupsIds}, function (result) {
            $scope.groups = result;
          });
        }

        startPulling();

        $scope.unselectGroup = function (grpId) {
          $scope.flatGroups.find(function (x) {
            return x.id === grpId;
          })['ticked'] = false;
        }

      }]);

