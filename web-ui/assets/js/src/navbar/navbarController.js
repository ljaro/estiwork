/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

angular.module('myApp.navbar')
.controller('navbarController', ['$scope', '$resource', '$translate', '$log', function($scope, $resource, $translate, $log){
	$scope.changeLanguage = function (langKey) {
    $translate.use(langKey);
  };

	 function logTrace($log) {
	   $log.logLevels['a.b.c'] = $log.LEVEL.TRACE;
	}

}]);
