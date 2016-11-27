/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

angular.module('myApp.workerview',
  ['myApp.workerselect',
    'myApp.commonservices',
    'myApp.checklistModule',
    //'smart-table',
    'ngResource'
  ]
).controller('workerviewController',
  ['$scope', '$http', '$resource', 'checklistSelected','GroupsService','WorkersService' ,'$log',
    function ($scope, $http, $resource, checklistSelected, GroupsService, WorkersService, $log){

      $scope.datePicker = {date: {startDate:moment(), endDate:moment()} };
      $scope.groupSelections = {};

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
            moment()
          ],
          "Last Month": [
            moment().startOf('month').subtract(2, 'days').startOf('month'),
            moment().startOf('month').subtract(2, 'days').endOf('month')
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

      //TODO: zrobic inline w szablonie
      $scope.calendarModeDays = function(){
        $scope.minViewMode = 0;
        $scope.interval = 'days';
      }

      //TODO: zrobic inline w szablonie
      $scope.calendarModeWeeks = function(){
        $scope.minViewMode = 0;
        $scope.interval = 'weeks';
      }

      //TODO: zrobic inline w szablonie
      $scope.calendarModeMonths = function(){
        $scope.minViewMode = 1;
        $scope.interval = 'months';
      }

      //TODO: zrobic inline w szablonie
      $scope.calendarModeYears = function(){
        $scope.minViewMode = 2;
        $scope.interval = 'years';
      }



      var flatFun = function(data) {
        // translate groups to flat json
        var flatGroups = [];
        angular.forEach(data, function(value, key){
          var newGrpItm = {
            'name': value.name,
            multiSelectGroup: true
          };
          this.push(newGrpItm);
          angular.forEach(value.workers, function(value, key){

            var itm = {
              'name': value.login,
              'id': value.id,
              ticked: false
            };
            this.push(itm);
          }, flatGroups);
          this.push({multiSelectGroup: false});
        }, flatGroups);

        return flatGroups;
      };

      GroupsService.all.query(function(res){
        $scope.flatGroups = flatFun(res);
      });


      $scope.loadData = function(id, interval, from, to){

        //TODO: change id to worker (align with REST url)
        WorkersService.workerData.query({id:id, interval:interval, from:from.toDate().toISOString(), to:to.toDate().toISOString() }, function(result){

          if(typeof result[0] !== 'undefined')
          {
            $scope.worker_info = result.info;
            $scope.table = result[0].data.map(function(itm){
              var newItm = itm;
              newItm.date = newItm.login_datetime;
              return newItm;
            });
          }
          else
          {
            //TODO: error handling
            $log.error('no data received');
          }
        });
      }
    }])
  //TODO: move to filters
  //TODO: refactor to more generic using moment.js and define format inside angular template html
  .filter('dateAggregator', function () {
    return function (input, interval) {

      function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }

      var intervalToInt = function(interval){

        if(isNumeric(interval))
          return interval;

        switch (interval){
          case 'long_day':
            return 0;
          case 'short_day':
            return 1;
          case 'month':
            return 2;
          case 'year':
            return 3;
        }
      }

      if(typeof interval !== undefined)
      {
        var int = intervalToInt(interval);

        switch (int){
          case 0:
            return moment(input).format("YYYY-MM-DD");
          case 1:
            return moment(input).format("MM-DD");
          case 2:
            return moment(input).format("YYYY-MM");
          case 3:
            return moment(input).format("YYYY");
        }
      }

      return 'err';
    };
  })
  .filter('dateAggregator2', function () {
    return function (input, interval) {

      var intervalToInt = function(interval){

        switch (interval){
          case 'days':
            return 0;
          case 'weeks':
            return 1;
          case 'months':
            return 2;
          case 'years':
            return 3;
        }
      }

      if(typeof interval !== undefined)
      {
        var int = intervalToInt(interval);

        switch (int){
          case 0:
            return moment(input).format("YYYY-MM-DD");
          case 1:
            return moment(input).startOf('week').format("MM-DD")+' '+moment(input).endOf('week').format("MM-DD");
          case 2:
            return moment(input).format("YYYY-MM");
          case 3:
            return moment(input).format("YYYY");
        }
      }

      return 'err';
    };
  });
