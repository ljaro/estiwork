/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

angular.module('myApp.quickview')

  .controller('quickViewController', ['$scope', '$resource', 'GroupsService', 'Utils', '$timeout',
    function ($scope, $resource, GroupsService, Utils, $timeout) {

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


      $scope.$watch('groupSelections', function (newValue, oldValue) {
        if (typeof $scope.groups !== 'undefined' && oldValue.length == 0) {
          $scope.loadData($scope.groupSelections);
        }
      });


      $scope.loadData = function (groups, callback) {

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

        $resource('/quickview/group/:id').query({id: groupsIds},
          function (result) {
            $scope.groups = result;

            if (typeof callback == typeof Function) {
              callback();
            }
          });
      }

      var startPulling = function () {
        var callTimer = $timeout(function () {
          $scope.loadData($scope.groupSelections, startPulling);
        }, 2000);

        $scope.$on('$destroy', function () {
          $timeout.cancel(callTimer);
        });
      }

      startPulling();

      $scope.unselectGroup = function (grpId) {
        $scope.flatGroups.find(function (x) {
          return x.id === grpId;
        })['ticked'] = false;
      }

    }]);

