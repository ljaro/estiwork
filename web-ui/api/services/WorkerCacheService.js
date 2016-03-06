/**
 * Created by luk on 2016-03-05.
 */

var Q = require('q');

var WorkerCacheService = {
  get: function getService(login) {

    var __found = function (data) {
      return Q.fcall(function () {
        return data;
      });
    }


    var __notfound = function (err) {
      return Q.fcall(function () {
        return err;
      });
    }

    var __searchFun = function (arg1) {
      return Worker.findOneByLogin(arg1);
    }

    var p = __searchFun(login);
    p.then(__found, __notfound);
    return p;

  },

  getOrCreate: function getOrCreateService(login) {

  }
}

module.exports = WorkerCacheService;
