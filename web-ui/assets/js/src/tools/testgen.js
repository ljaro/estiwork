/**
 * New node file
 */
angular.module('myApp.testgen', ['ngResource'])

.controller('testgenController',
		['$scope', '$http', '$resource', function ($scope, $http, $resource){

			$scope.textarea = {};
			$scope.logi = {};

			$scope.sendGen = function(){
				console.log('sendGen');
				console.log($scope.textarea.value);
				$scope.logi.value = '';
				$http.post('/testgen', $scope.textarea.value).
				success(function(data, status, headers, config) {
				    console.log('success '+status);
				    $scope.logi.value = 'Success:'+status;
				  }).
				error(function(data, status, headers, config) {
					console.log('error '+status);
					$scope.logi.value = 'Error:'+status;
				  });

			}

}]);
