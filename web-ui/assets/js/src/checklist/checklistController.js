/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

angular.module('myApp.checklistModule')
  .controller('checklistController',
  ['$scope',
    '$resource',
    'checklistSelected',
    'GroupsService',

    function($scope, $resource, checklistSelected, GroupsService){

      $scope.groupSelections = checklistSelected;

      GroupsService.all.query(function(data) {
        $scope.groups = data;
      });


    }]).directive('myCheckList', ['$document', function(scope, element, attr) {

    return {
      restrict: 'E',
      templateUrl: 'js/src/checklist/checklist.html',
      scope: {
        data: '=data',
        groupSelections: '=model'
      },
      compile: function (element, attrs){
        return function(scope, elem, attrs) {
          $(elem).find('ul').click(function(e){

            e.stopPropagation();

            var checked = $(e.target).prop('active') || false;

            if($(e.target).is('a')){
              var child_input = $(e.target).find('input');
              child_input.trigger("click");
              checked = child_input.prop("checked");
            }
            else if($(e.target).is('label')) {
              var child_input = $(e.target).find('input');
              checked = child_input.prop("checked");
            }
            else if($(e.target).is('input')) {
              checked = $(e.target).prop("checked");
            }


            if (checked) {
              $(e.target).parents('li').addClass("active");
            }
            else {
              $(e.target).parents('li').removeClass("active");
            }

          });



        }
      }
    };

  }]);
