/**
 * Created by luk on 2016-03-19.
 */

var Q = require('q');

var WorkstationCacheService = {

  get: function getOrCreateService(sid) {
    return Workstation.findOneByMachine_sid({machine_sid: sid});
  },


  getOrCreate: function getOrCreateService(sid) {

    function __findOrCreateWorkstation(sid) {
      var findCrit = {
        machine_sid: sid
      };

      var createCrit = {
        name: sid,
        machine_sid: sid,
        auto_created: 1,
      };

      return Workstation.findOrCreate(findCrit, createCrit).fail(function (err) {

        if(err.originalError.code !== 11000){
          return Q.reject(err);
        }

        var d = Q.defer();
        setTimeout(function () {
          var resolvetion = __findOrCreateWorkstation(sid);
          d.resolve(resolvetion);
        }, 200);
        return d.promise;
      });
    }

    return __findOrCreateWorkstation(sid);
  }
}


module.exports = WorkstationCacheService;
