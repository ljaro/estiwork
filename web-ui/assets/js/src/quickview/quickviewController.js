/**
 *
 */
angular.module('myApp.quickview', ['ngResource', 'ui.grid', 'ui.bootstrap', 'myApp.blinky'])

  .controller('quickViewController',
  ['$scope', '$http', '$resource', '$interval', 'checklistSelected', 'GroupsService', 'uiGridConstants',
    function ($scope, $http, $resource, $interval, checklistSelected, GroupsService, uiGridConstants) {


      $scope.flatGroups = [];
      $scope.test = 0;

      $scope.filterSelection = function (x) {
        var res = $scope.flatGroups.find(function (xx) {
          return xx.id === x && xx.ticked;
        });
        return res !== undefined;
      }

      GroupsService.all.query(function (data) {

        // translate groups to flat json
        var flatGroups = [];
        angular.forEach(data, function (value, key) {
          var newGrpItm = {'id': value.id, 'name': value.name, 'ticked': true};
          this.push(newGrpItm);
        }, flatGroups);

        $scope.flatGroups = flatGroups;
        $scope.groups = data.groups;
      });

      $scope.groupSelections = [];
      $scope.getSelected = function (data) {
        console.log($scope.groupSelections);
      };


      var last_groups;


      function refresh() {
        $interval(function () {
          if (last_groups !== undefined) {
            $scope.loadData(last_groups);
          }
        }, 2000, false);
      }


      $scope.loadData = function (array_of_groups) {

        // console.log("load data:" + array_of_groups);

        last_groups = array_of_groups;

        var true_array = [];

        angular.forEach(array_of_groups, function (value, key) {
          console.log(value.id);
          this.push(value.id);

        }, true_array);

        if (typeof true_array === 'undefined' || true_array.length == 0) {
          $scope.tabledata = {};
          $scope.tabledata.groups = null;
          return;
        }

        var Groups = $resource('/quickview/group/:id');
        Groups.query({id: true_array}, function (data) {
          $scope.tabledata['groups'] = data;
        });
      }


      $scope.loadData($scope.groupSelections);
      refresh();


      $scope.test = "To jest test";

      $scope.unselectGroup = function (grpId) {
        console.log('unselecting:' + grpId);


        //TODO remove?
        // $scope.tabledata.groups = $scope.tabledata.groups.filter(function (obj) {
        //   return obj.id !== grpId;
        // });

        $scope.flatGroups.find(function (x) {
          return x.id === grpId;
        })['ticked'] = false;

        console.log('unselected after:' + JSON.stringify($scope.groupSelections));
      }


      $scope.prepareTooltip = function (row) {
        console.log(row);
      }
    }]);

