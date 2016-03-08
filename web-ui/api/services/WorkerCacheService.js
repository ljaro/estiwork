/**
 * Created by luk on 2016-03-05.
 */

var Q = require('q');

var WorkerCacheService = {
  get: function getService(login, usersid) {
    return Worker.findOneByLogin({login: login, user_sid: usersid});
  },

  getOrCreate: function getOrCreateService(login, usersid) {

    function __findOrCreateWorker(grp) {
      var findCrit = {
        login: login,
        user_sid: usersid
      };

      var createCrit = {
        login: login,
        user_sid: usersid,
        auto_created: 1,
        group: grp.id
      };

      return Worker.findOrCreate(findCrit, createCrit).fail(function (err) {

        if(err.originalError.code !== 11000){
          return Q.reject(err);
        }

        var d = Q.defer();
        setTimeout(function () {
          var resolvetion = __findOrCreateWorker(grp);
          d.resolve(resolvetion);
        }, 200);
        return d.promise;
      });
    }

    return Group.findOneByName("Unknown").then(function (grp) {
      return __findOrCreateWorker(grp);
    });

  }

}

module.exports = WorkerCacheService;
