/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

angular.module('myApp.navbar')
.controller('navbarController', ['$scope', '$resource', '$translate', function($scope, $resource, $translate){
	$scope.changeLanguage = function (langKey) {
    $translate.use(langKey);
  };
}]);
