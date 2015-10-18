/**
 * 
 */

angular.module('myApp.reportview')

.controller('reportviewController', 
		['$scope', '$http', '$resource', function ($scope, $http, $resource){
	
		$scope.reportSelected = [];
		$scope.report_templates = 
			[
			 {
				 "id":"1",
				 "name": "szablon_1",
				 "tpl_url":"src/reports_tpl/template1.html"
			 },
			 {
				 "id":"2",
				 "name": "szablon2",
				 "tpl_url":"src/reports_tpl/tpl_aktywnosc.html"
			 },
			 {
				 "id":"3",
				 "name": "szablon_aktywnosc_grupowa",
				 "tpl_url":"src/reports_tpl/template3.html"
			 },
			 {
				 "id":"4",
				 "name": "szablon_aktywnosc_bezczynn",
				 "tpl_url":"src/reports_tpl/template4.html"
			 }


			 ];
		
		
	
	    	  
}]);