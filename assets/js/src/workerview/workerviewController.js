/**
 *
 */

angular.module('myApp.workerview',
  ['myApp.workerselect',
   'myApp.commonservices',
   'myApp.checklistModule'
  ]
).controller('workerviewController',
  ['$scope', '$http', '$resource', 'checklistSelected','GroupsService','WorkersService' ,
    function ($scope, $http, $resource, checklistSelected, GroupsService, WorkersService){

    $scope.data1 = new Date();
    $scope.data2 = new Date();
    $scope.groupSelections = {};

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
            'name' : value.fullname,
            'id' : value.id,
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

      WorkersService.workerData.query({id:id, interval:interval, from:from.toISOString(), to:to.toISOString() }, function(result){

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
          console.log('no data received');
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
        return +interval;

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
  });
