/**
 * Created by luk on 2016-03-10.
 */
angular.module('myApp.blinky')
  .directive('blinkOnChange', function ($animate, $timeout) {
    return function (scope, elem, attr) {
      scope.$watch(attr.blinkOnChange, function (nv, ov) {

        if (nv != ov) {
          elem.addClass('changed');
          $timeout(function () {
            elem.removeClass('changed');
          }, 1000);
        }
      }, true);
    };
  });