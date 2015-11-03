/**
 * Created by luk on 2015-11-03.
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
