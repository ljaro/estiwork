
angular.module('myApp.quickview', ['ngResource', 'ui.grid', 'ui.bootstrap', 'myApp.blinky'])
.service('Utils', function () {

  this.flatGroups = function (groups) {
    // translate groups to flat json
    var flatGroups = [];
    angular.forEach(groups, function (value, key) {
      var newGrpItm = {'id': value.id, 'name': value.name, 'ticked': true};
      this.push(newGrpItm);
    }, flatGroups);
    return flatGroups;
  }
});
