/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

angular.module('myApp.feedback', ['ngResource'])
  .controller('feedbackController',
  ['$scope', '$resource', '$timeout', '$http', function ($scope, $resource, $timeout, $http){
  	
  	$scope.isClicked = false;

  	$scope.submitFeedback = function(){
  		if ($scope.isClicked === false){
  			$scope.isClicked = true;
        var data = {text : $scope.feedback};
        $http.post('/feedback', data)
            .success(function (data, status, headers, config) {
                $scope.message = data;
            })
            .error(function (data, status, header, config) {
                alert( "failure message: " + JSON.stringify({data: data}));
            });  
  			$timeout(function() {
  				$scope.isClicked = false;
		    }, 5000);
        $scope.feedback = "";
  		}
  	};

  }]);