/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

angular.module('myApp.feedback', ['ngResource'])
  .controller('feedbackController',
  ['$scope', '$resource', '$timeout', '$http', function ($scope, $resource, $timeout, $http){
  	
    $scope.feedback = {};
  	$scope.isClicked = false;

  	$scope.submitFeedback = function(){

      if (Object.keys($scope.feedback).length !== 0) {
        var trimmedText = $scope.feedback.text.trim();
        if (trimmedText.length > 0 && $scope.isClicked === false) {
    			$scope.isClicked = true;
          var data = {text : trimmedText};
          $http.post('/feedback', data)
              .success(function (data, status, headers, confarig) {
                  console.log( "Success: " + JSON.stringify({data: data}));
              })
              .error(function (data, status, header, config) {
                  console.log( "failure message: " + JSON.stringify({data: data}));
              });  
    			$timeout(function() {
    				$scope.isClicked = false;
  		    }, 5000);
          $scope.feedback = {};
        }
      } 
  	};

  }]);