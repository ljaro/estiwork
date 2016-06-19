/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
angular.module('myApp.blinky')
  .directive('blinkOnChange', function ($animate, $timeout) {
    return function (scope, elem, attr) {
      scope.$watch(attr.blinkOnChange, function (nv, ov) {

        if (nv != ov) {

          var style = (nv.app_category === 'PRODUCTIVE' ? 'changed_green' : 'changed_red');

          elem.addClass(style);
          $timeout(function () {
            elem.removeClass(style);
          }, 1000);
        }
      }, true);
    };
  });
