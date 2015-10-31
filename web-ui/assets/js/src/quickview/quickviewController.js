/**
 *
 */
angular.module('myApp.quickview', ['ngResource', 'ui.grid'])

  .controller('quickViewController',
  ['$scope', '$http', '$resource', 'checklistSelected', 'GroupsService', 'uiGridConstants', function ($scope, $http, $resource, checklistSelected, GroupsService, uiGridConstants){


    $scope.flatGroups = [];

    GroupsService.all.query(function(data) {

      // translate groups to flat json
      var flatGroups = [];
      angular.forEach(data, function(value, key){
        var newGrpItm = {'id'  : value.id, 'name': value.name, 'ticked': false};
        this.push(newGrpItm);
      }, flatGroups);

      $scope.flatGroups = flatGroups;
      $scope.groups = data.groups;
    });

    $scope.groupSelections = [];
    $scope.getSelected = function(data) {
      console.log($scope.groupSelections);
    };




    $scope.loadData = function(array_of_groups) {

      console.log("load data:"+array_of_groups);

      var true_array = [];

      angular.forEach(array_of_groups, function(value, key){
        console.log(value.id);
        this.push(value.id);

      }, true_array);

      if(typeof true_array === 'undefined' || true_array.length == 0) {
        $scope.tabledata = {};
        $scope.tabledata.groups = null;
        return;
      }

      var Groups = $resource('/quickview/group/:id');
      Groups.query({id:true_array}, function(data) {
        $scope.tabledata = {groups:[]};
        $scope.tabledata.groups = data;
      });
    }






    $scope.loadData($scope.groupSelections);
    $scope.test = "To jest test";

    $scope.unselectGroup = function(grpId) {
      console.log('unselecting:'+grpId);


      $scope.tabledata.groups = $scope.tabledata.groups.filter(function( obj ) {
        return obj.id !== grpId;
      });

      $scope.groupSelections.splice($scope.groupSelections.indexOf(grpId), 1);

      console.log('unselected after:'+$scope.groupSelections);
    }


    $scope.prepareTooltip = function(row) {
      console.log(row);
    }
  }]);

