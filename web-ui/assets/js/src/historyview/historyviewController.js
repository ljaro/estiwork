/**
 *
 */

angular.module('myApp.historyview')

.controller('historyviewController',
		['$scope', '$http', '$resource', 'checklistSelected', function ($scope, $http, $resource, checklistSelected){

			var now = new Date();
			now.setHours(0,0,0,0);

			$scope.data1 = now;
			$scope.data2 = now;
			$scope.groupSelections = [];

			$scope.loadData = function(array_of_groups) {

				console.log("load data:"+array_of_groups);

				var true_array = array_of_groups;


				if(typeof true_array === 'undefined' || true_array.length == 0) {
					$scope.tabledata = {};
					$scope.tabledata.groups = null;
					return;
				}

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

				console.log('BEGIN:'+beginOfDay($scope.data1));
				console.log('END:'+end_of_day);

				var Groups = $resource('/historyview/group/:id/range/:from,:to');
				var user = Groups.query({id:true_array, from:beginOfDay($scope.data1).toISOString(), to:end_of_day.toISOString()}, function(data) {
					$scope.tabledata = {groups:[]};
					$scope.tabledata.groups = data;
				});
			}


			$scope.loadData($scope.groupSelections);

}]);
