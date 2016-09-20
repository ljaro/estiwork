/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

angular.module('myApp.workerselect')
.controller('workerselectController', ['$scope', 'GroupsService', function($scope, GroupsService) {

	var grps = GroupsService.all.query(function(data) {

	    $scope.groups = data;

	    // translate groups to flat json
	    var flatGroups = [];
	    angular.forEach(data, function(value, key){
	    	var newGrpItm = {
	    			'name': value.name,
	    			multiSelectGroup: true
	    			};
	    	this.push(newGrpItm);
	    	angular.forEach(value.workers, function(value, key){

	    		var itm = {
		    			'name' : value.login,
		    			ticked: false
		    			};
	    		this.push(itm);
	    	}, flatGroups);
	    	this.push({multiSelectGroup: false});
	    }, flatGroups);

	    $scope.flatGroups = flatGroups;

      console.log($scope.flatGroups);
	  });

}]);
