'use strict';

describe('myApp.calendarModule', function() {
  var element, scope, $compile, $templateCache, $timeout;
  beforeEach(module('myApp.calendarModule'));
 // beforeEach(module('js/src/components/calendar/calendar.html'));
  beforeEach(inject(function($rootScope, _$compile_, _$templateCache_, _$timeout_) {
    scope = $rootScope;
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    $timeout = _$timeout_;

    var html1 =
      '<div>' +
      '<my-calendar first="datePicker.date.startDate" second="datePicker.date.endDate" min-view-mode="minViewMode"></my-calendar>' +
      '</div>';

    $scope.datePicker = {date: {startDate:moment(), endDate:moment()} };

  }));

  describe('yyyyy', function(){
    it('xxxxxx hg g xxxxxxxx', function(){
      element = $compile(html1)(scope);
      scope.$digest();
      expect(1).toBe(1);
    });
  });

});
