/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

//TODO: clean commented code
//TODO: in onRegisterApi: add response handler in WorkersService
//TODO: what if  WorkersService.worker.save({id:rowEntity._id}, entry) break connection and get response error??
//TODO: onRegisterApi extract function
//TODO: extract grid as module/controller and include in configurationController/View, also change tests suite
//TODO: try extract grid to directive with CRUD functionality (BIG thing for github project)


angular.module('myApp.configuration', ['myApp.commonservices', 'ui.grid'])

.controller('configurationController',
		['$scope', 'WorkersService', 'GroupsService', '$filter', 'uiGridConstants', function ($scope, WorkersService, GroupsService, $filter, uiGridConstants){

			$scope.changes = {};

			$scope.gridOptions = {
					enableCellEditOnFocus: true,
					enableColumnResizing: true,
					columnDefs: [
					             {field:	' ', width: 25},
					             {field: 	'login', 		displayName: 'Login', width: '10%'			},
					             {field: 	'fullname',		displayName: 'Imie i nazwisko',	width: '18%'},
					             {field:	'leader',		displayName: 'Szef',
					            	 editableCellTemplate: 'ui-grid/dropdownEditor',
					            	 editDropdownValueLabel: 'login',
					            	 editDropdownIdLabel: 'id',
					            	 editModelField: 'leader.id',
					            	 editDropdownOptionsArray: $scope.workers,
					            	 cellFilter :  "griddropdown: grid.appScope.workers : 'id' : 'login' : row.entity.leader ",
					            	 width: '20%'},


                       {field:	'group',		displayName: 'Grupa',
                          editableCellTemplate: 'ui-grid/dropdownEditor',
                          editDropdownValueLabel: 'name',
                          editDropdownIdLabel: 'id',
                          editModelField: 'group.id',
                          editDropdownOptionsArray: $scope.groups,
                          cellFilter :  "griddropdown: grid.appScope.groups :'id':'name':row.entity.group",
                          width: '20%'}


					             ],
			//TODO: nie trzeba wysylac zmian do bazy jesli nic sie nie zmienilo w polu
				onRegisterApi: function( gridApi ) {
			      $scope.gridApi = gridApi;
			      gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue){
			            var entry = {};
			            entry[colDef.name] = newValue;
			    	  	  //$scope.changes[rowEntity._id] = entry;
			            //$scope.$apply();
			            // colDef.name moze to byc dowolna kolumna podana przez atakujacego ??????????????????????
                  WorkersService.worker.save({id:rowEntity.id}, entry);
			          });
			    }
			};

      GroupsService.all.query().$promise.then(function(res) {
        $scope.groups = res;
        $scope.gridOptions.columnDefs[4].editDropdownOptionsArray = res;
      });

			WorkersService.all.query().$promise.then(function(res) {
				$scope.workers = res;
				$scope.gridOptions.data = res;
				$scope.gridOptions.columnDefs[3].editDropdownOptionsArray = res;
			});

      // should add new empty entry to $scope.workers
      // should update entry in $scope.workers to have id from response
      $scope.addData = function() {
        var n = $scope.gridOptions.data.length + 1;
        var newItm = {
          "login": "New " + n,
          "fullname": "Person " + n,
          "leader": null,
          "group": null,
        }

        var len = $scope.workers.push(newItm);

        WorkersService.worker.save(newItm, function(createdItem){

          //fix: waterline returns _id as id; value is already saved in db so not need to resend
          //createdItem._id = createdItem.id;
          //delete createdItem.id;

          $scope.workers[len-1] = createdItem;

        });
      };

}])
.filter('griddropdown', function () {
    return function (input, entity, idField, valueField, initial) {

      var map = entity;
      if(idField !== null && typeof input !== "undefined" && input.hasOwnProperty(idField)) {
        var input = input[idField];
      }

      if (typeof entity !== "undefined") {
        for (var i = 0; i < map.length; i++) {
          if (map[i]['id'] == input) {
            return map[i][valueField];
          }
        }
      } else if (initial) {
        return initial;
      }
      return input;
    };
});


