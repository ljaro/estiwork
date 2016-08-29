/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

angular.module('myApp.feedback', ['ngResource'])
  .controller('feedbackController',
  ['$scope', '$resource', '$timeout', function ($scope, $resource, $timeout){
  	
  	$scope.isClicked = false;

  	$scope.submitFeedback = function(){
  		if ($scope.isClicked === false){
  			$scope.isClicked = true;
  			$timeout(function() {
  				$scope.isClicked = false;
		    }, 5000);
  		}
  	};

  }]);