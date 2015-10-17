/**
 *
 */

angular.module('myApp.calendarModule')
.controller('calendarController', ['$scope', '$resource', 	function($scope, $resource){

	$scope.first = new Date(2015,05,11);
	$scope.second = new Date(2015,05,14);

}]).directive('myCalendar', ['$document', function(scope, element, attr) {

	return {
		restrict: 'E',
		templateUrl: 'js/src/components/calendar/calendar.html',
		scope: {
			first: '=first',
			second: '=second'
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



				angular.element('.input-daterange').datepicker({
					language : 'pl'
				}).on('changeDate', function(e){

					if(updateToScopeEnabled){

						scope.$evalAsync(function(){

							if(e.target.id == 'cal1')
							{
								scope.first = beginOfDay(e.date);
							}
							else if(e.target.id == 'cal2')
							{
								scope.second = beginOfDay(e.date);
							}
							else
								console.log('myCalendar event clicn err')
						});
					}


				});

				scope.$watch('first', function(){
					updateToScopeEnabled = false;
					angular.element('#cal1').datepicker('setDate', beginOfDay(scope.first));
					//console.log(beginOfDay(scope.first));
					updateToScopeEnabled = true;
					});
				scope.$watch('second', function(){
					updateToScopeEnabled = false;
					angular.element('#cal2').datepicker('setDate', beginOfDay(scope.second));
					console.log(scope.second);
					updateToScopeEnabled = true;
					});

				//TODO: pomyslec czy now()-jeden dzien dziala zawsze poprawnie np. now()==23:00  - jeden dzien czyli 24 h = na prawde poprzedni dzien
				scope.yesterday = function(){
					console.log('yesterday');
					var result = moment().subtract(1, 'days').utc().toDate();
					angular.element('#cal1').datepicker('setDate', beginOfDay(result));
					angular.element('#cal2').datepicker('setDate', beginOfDay(result));
				}

				scope.last7days = function(){
					console.log('yesterday');
					var result = moment().firstDatOfWeek.utc().toDate();
					angular.element('#cal1').datepicker('setDate', beginOfDay(result));
					angular.element('#cal2').datepicker('setDate', beginOfDay(result));
				}

			}
		}

}]);
