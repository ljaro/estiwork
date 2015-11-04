/**
 *
 */

angular.module('myApp.historyview',
  [
    'ngResource',
    'myApp.checklistModule',
    'smart-table',
    'myApp.utils'
  ])

.controller('historyviewController',
		['$scope', '$http', '$resource', 'checklistSelected', function ($scope, $http, $resource, checklistSelected){

      $scope.varShowCalendar = true;
      $scope.varShowSmallCalendar = false;
      $scope.datePicker = {date: {startDate:moment(), endDate:moment()} };
			$scope.groupSelections = [];

      $scope.datePicker.options = {
        "autoApply": false,
        "ranges": {
          "Today": [
            moment(),
            moment()
          ],
          "Yesterday": [
            moment().subtract(1,'days'),
            moment().subtract(1,'days')
          ],
          "Last 7 Days": [
            moment().subtract(6,'days'),
            moment()
          ],
          "Last 30 Days": [
            moment().subtract(30,'days'),
            moment()
          ],
          "This Month": [
            moment().startOf('month'),
            moment(),
          ],
          "Last Month": [
            moment().startOf('month').subtract(2, 'days').startOf('month'),
            moment().startOf('month').subtract(2, 'days').endOf('month'),
          ]
        },
        "locale": {
          "format": "MM/DD/YYYY",
          "separator": " - ",
          "applyLabel": "Apply",
          "cancelLabel": "Cancel",
          "fromLabel": "From",
          "toLabel": "To",
          "customRangeLabel": "Custom",
          "daysOfWeek": [
            "Su",
            "Mo",
            "Tu",
            "We",
            "Th",
            "Fr",
            "Sa"
          ],
          "monthNames": [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
          ],
          "firstDay": 1
        },
        "startDate": "10/28/2015",
        "endDate": "11/03/2015"
      };


			$scope.loadData = function(array_of_groups) {

				var true_array = array_of_groups;


				if(typeof true_array === 'undefined' || true_array.length == 0) {
					$scope.tabledata = {};
					$scope.tabledata.groups = null;
					return;
				}

        //TODO move to some utils file
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

				var end_of_day = endOfDay($scope.datePicker.date.endDate.toDate());


        //TODO change to moment.js
				var Groups = $resource('/historyview/group/:id/range/:from,:to');
				Groups.query({id:true_array, from:beginOfDay($scope.datePicker.date.startDate.toDate()).toISOString(), to:end_of_day.toISOString()}, function(data) {

					$scope.tabledata = {groups:[]};
					$scope.tabledata.groups = data;
				});
			}


			$scope.loadData($scope.groupSelections);


      //TODO: kolejna rzecz do skomonalizowania
      $scope.calendarSetToday = function(startDate, endDate) {
        $scope.datePicker.date.startDate = moment().startOf('day');
        $scope.datePicker.date.endDate = moment().endOf('day');
      }

      //TODO: kolejna rzecz do skomonalizowania
      $scope.calendarSetYesterday = function(startDate, endDate) {
        $scope.datePicker.date.startDate = moment().subtract(1, 'days');
        $scope.datePicker.date.endDate = moment().subtract(1, 'days');
      }

      //TODO: kolejna rzecz do skomonalizowania
      $scope.calendarSetLast7days = function(startDate, endDate) {
        $scope.datePicker.date.startDate = moment().subtract(6, 'days');
        $scope.datePicker.date.endDate = moment().endOf('day');
      }

      //TODO: kolejna rzecz do skomonalizowania
      $scope.calendarSetLast30days = function(startDate, endDate) {
        $scope.datePicker.date.startDate = moment().subtract(30,'days');
        $scope.datePicker.date.endDate = moment().endOf('day');
      }

}]);
