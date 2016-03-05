/**
 * Created by luk on 2016-02-22.
 */

var q = require('q');

var EventsPersistancyService = {
  accept: function acceptService(msg) {

    function handleNotFoundWorker() {
      console.log('handleNotFoundWorker');
    }

    try {

      function _getAppCategory() {
        var defer = q.defer();

        setTimeout(function () {
          defer.resolve('cos');
        }, 500);

        return defer.promise;
      }

      //TODO extend finding by more properties
      function _getWorkerId(login) {
        return Worker.findOneByLogin(login);
      }

      var content = msg.content.toString();
      content = JSON.parse(content);

      _getWorkerId('Tate2').then(function (res) {
        if(res === undefined){
          handleNotFoundWorker();
        }


      }).catch(function (err) {
        console.log(err);
      });

      //_getAppCategory().when(function(err, res){
      //  content["app_category"] = res;
      //}).then(function(err, res){
      //  content["worker_id"] = _getWorkerId();
      //  Event.create(content).then(function (x) {});
      //});
    }
    catch(err){
      console.log(err);
    }

  }
}

module.exports = EventsPersistancyService;
