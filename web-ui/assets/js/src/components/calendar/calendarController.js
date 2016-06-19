/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

angular.module('myApp.calendarModule')
  .controller('calendarController', ['$scope', '$resource', 	function($scope, $resource){


    $scope.minViewMode = 1;

  }]).directive('myCalendar', ['$document', function(scope, element, attr, $compile) {

    return {
      restrict: 'E',
      templateUrl: 'js/src/components/calendar/calendar.html',
      scope: {
        first: '=',
        second: '=',
        minViewMode: '='
      },
      link: function(scope, elem, attrs, $compile) {


        var updateToScopeEnabled = true;
        var viewMode = -1;


        var bindChangeDate = function(elem2){
          elem2.on('changeDate', function(e){

            if(updateToScopeEnabled){

              scope.$evalAsync(function(){

                console.log('ddsfsdfsdfsdfsdfsd' + viewMode);

                var numToStrModes = ['day', 'month', 'year'];

                if(e.target.id == 'cal1') {
                  // cause calendar component store date in Date format...we want moment as output
                  var momentDate = moment(e.date);
                  scope.first = momentDate.startOf(numToStrModes[viewMode]);
                }
                else if(e.target.id == 'cal2') {
                  var momentDate = moment(e.date);
                  scope.second = momentDate.endOf(numToStrModes[viewMode]);
                }
                else {
                  console.log('myCalendar event clicn err')
                }
              });
            }
          });
        }

        scope.$watch('first', function(){
          updateToScopeEnabled = false;

          try{
            var moment = scope.first.startOf('day');
            var d = moment.toDate();
            angular.element('#cal1').datepicker('setDate', d);
          }finally{
            updateToScopeEnabled = true;
          }
        });

        scope.$watch('second', function(){
          updateToScopeEnabled = false;
          try {
            console.log('second');
            var moment = scope.second.startOf('day');
            var d = moment.toDate();
            angular.element('#cal2').datepicker('setDate', d);
          }finally {
            updateToScopeEnabled = true;
          }
        });

        scope.$watch('minViewMode', function(){


          if(viewMode !== scope.minViewMode){

            console.log("watch minViewMode");

            elem.find('.input-daterange').datepicker('remove');
            elem.find('.input-daterange').remove();
            elem.append('<div class="input-daterange" style="line-height: 1.3;"><table> <tr> <td style="padding-right: 15px;"><div id="cal1" value="2012-04-05"></div></td> <td style="padding-right: 15px;"><div id="cal2" value="2012-04-07"></div></td> </tr> </table></div>');

            var domElem = elem.find('.input-daterange').datepicker({
              language : 'pl',
              minViewMode : scope.minViewMode
            });

            bindChangeDate(domElem);

            viewMode = scope.minViewMode;
          }
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
