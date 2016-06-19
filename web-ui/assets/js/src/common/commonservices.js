/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

angular.module('myApp.commonservices', ['ngResource'])
.factory('GroupsService', ['$resource', function($resource){
	//return $resource('/group',  {id:'@id'}, {'query': {method: 'GET', isArray:'true'}} );

    return {
      all: $resource('/group',  {}, {cache:false} )
    };

}])
.factory('WorkersService', ['$resource', function($resource){
	return {
		all : $resource('/worker',  {}, {cache:false} ),
    worker : $resource('/worker/:id', {}, {}, {cache:false} ),
    workerData : $resource('/workerview/worker/:id/interval/:interval/range/:from,:to', {}, {'query': {method: 'GET', isArray:'true'}} )
	};
}]);
