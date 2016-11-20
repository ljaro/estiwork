/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

angular.module('myApp.navbar')
.controller('navbarController', ['$scope', '$resource', '$translate', '$location', function($scope, $resource, $translate, $location){
	$scope.changeLanguage = function (langKey) {
    $translate.use(langKey);
  };

  	var Socket = io.connect(window.location.protocol+'//'+window.location.host);
		function bind_socket(Socket) {
			
		    Socket.on('connect', function()  {
                $('.glyphicon-exclamation-sign').hide();
		    });

		    Socket.on('disconnect', function()  {
		    	$('.glyphicon-exclamation-sign').show();
		    });
		}

		bind_socket(Socket);

}]);
