/**
 *
 */

angular.module('myApp.calendarModule')
  .controller('calendarController', ['$scope', '$resource', 	function($scope, $resource){

    $scope.first = moment();
    $scope.second = moment();
    $scope.minViewMode = 1;

  }]).directive('myCalendar', ['$document', function(scope, element, attr) {

    return {
      restrict: 'E',
      templateUrl: 'js/src/components/calendar/calendar.html',
      scope: {
        first: '=',
        second: '=',
        minViewMode: '='
      },
      link: function(scope, elem, attrs) {


        var updateToScopeEnabled = true;

        var beginOfDay = function(date){
          var tmp = date;
          tmp.setHours(0,0,0,0);
          return tmp;
        }

        var endOfDay = function(date){
          var tmp = date;
          tmp.setHours(23,59,59,999);
          return tmp;
        }


        var bindChangeDate = function(elem2){
          elem2.on('changeDate', function(e){

            if(updateToScopeEnabled){

              scope.$evalAsync(function(){

                if(e.target.id == 'cal1') {
                  scope.first = beginOfDay(e.date);
                }
                else if(e.target.id == 'cal2') {
                  scope.second = beginOfDay(e.date);
                }
                else {
                  console.log('myCalendar event clicn err')
                }
              });
            }
          });
        }

        //var domElem = elem.find('.input-daterange').datepicker({
        //  language : 'pl'
        //});
        //
        //bindChangeDate(domElem);


        scope.$watch('first', function(){
          updateToScopeEnabled = false;

          console.log('watch first');

          var moment = scope.first.startOf('day');
          var d = moment.toDate();
          angular.element('#cal1').datepicker('setDate', d);

          updateToScopeEnabled = true;
        });

        scope.$watch('second', function(){
          updateToScopeEnabled = false;
          console.log('second');
          var moment = scope.second.startOf('day');
          var d = moment.toDate();
          angular.element('#cal2').datepicker('setDate', d);

          updateToScopeEnabled = true;
        });

        scope.$watch('minViewMode', function(){
          console.log('watch minViewMode');

          elem.find('.input-daterange').datepicker('remove');

          elem.find('.input-daterange').datepicker({
              language : 'pl',
              minViewMode : scope.minViewMode
          });

          bindChangeDate(domElem);

        });

        //TODO: pomyslec czy now()-jeden dzien dziala zawsze poprawnie np. now()==23:00  - jeden dzien czyli 24 h = na prawde poprzedni dzien(do wykomentowanego kodu ale sprawdzic czy dotyczy nadal)
        //scope.yesterday = function(){
        //	console.log('yesterday');
        //	var result = moment().subtract(1, 'days').utc().toDate();
        //	angular.element('#cal1').datepicker('setDate', beginOfDay(result));
        //	angular.element('#cal2').datepicker('setDate', beginOfDay(result));
        //}
        //
        //scope.last7days = function(){
        //	console.log('yesterday');
        //	var result = moment().firstDatOfWeek.utc().toDate();
        //	angular.element('#cal1').datepicker('setDate', beginOfDay(result));
        //	angular.element('#cal2').datepicker('setDate', beginOfDay(result));
        //}

      }
    }

  }]);
