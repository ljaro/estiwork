/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

var utils = angular.module('myApp.utils', []);


utils.directive('showOnHover', function(){
  return {
    link: function (scope, element, attrs) {
      element.parent().bind('mouseenter', function () {
        element.show();
      });
      element.parent().bind('mouseleave', function () {
        element.hide();
      });
    }
  }
});
