/**
 * Created by luk on 2016-03-05.
 */

var Q = require('q');

var WorkerCacheService = {
  get: function getService(login) {
    return Worker.findOneByLogin(login);
  },

  getOrCreate: function getOrCreateService(login) {
    return Worker.findOrCreate(login, {"login":login});
  }

}

module.exports = WorkerCacheService;
