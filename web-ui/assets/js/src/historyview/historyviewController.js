/**
 *
 */

angular.module('myApp.historyview',
  [
    'ngResource',
    'myApp.checklistModule',
    'smart-table'
  ])

.controller('historyviewController',
		['$scope', '$http', '$resource', 'checklistSelected', function ($scope, $http, $resource, checklistSelected){

			var now = new Date();
			now.setHours(0,0,0,0);

			$scope.data1 = now;
			$scope.data2 = now;
			$scope.groupSelections = [];



			$scope.loadData = function(array_of_groups) {

				var true_array = array_of_groups;


				if(typeof true_array === 'undefined' || true_array.length == 0) {
					$scope.tabledata = {};
					$scope.tabledata.groups = null;
					return;
				}

        //TODO move to some utils file
				var beginOfDay = function(date){
					var tmp = date;
					tmp.setHours(0,0,0,0);
					return tmp;
				}

				var endOfDay = function(date){
					var tmp = date;
					tmp.setHours(23,59,59,999);
					return tmp;
				}


				var end_of_day = endOfDay($scope.data2);

				var Groups = $resource('/historyview/group/:id/range/:from,:to');
				Groups.query({id:true_array, from:beginOfDay($scope.data1).toISOString(), to:end_of_day.toISOString()}, function(data) {

					$scope.tabledata = {groups:[]};
					$scope.tabledata.groups = data;
				});
			}


			$scope.loadData($scope.groupSelections);

}]);
