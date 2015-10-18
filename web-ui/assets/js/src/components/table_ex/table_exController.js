/**
 * 
 */

angular.module('myApp.tableexModule')
.controller('tableexController', 
		['$scope', 
		 '$resource', 	

function($scope, $resource){
	
	  
}]).directive('ewrkTable', ['$document', function(scope, element, attr) {
	
	return {
		restrict: 'E',
		templateUrl: 'src/components/table_ex/table_ex.html'
		}
	
}]);