/**
 * Created by luk on 2016-03-10.
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
