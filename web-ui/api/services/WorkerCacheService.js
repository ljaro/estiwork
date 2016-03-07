/**
 * Created by luk on 2016-03-05.
 */

var Q = require('q');

var WorkerCacheService = {
  get: function getService(login) {
    return Worker.findOneByLogin({login: login});
  },

  getOrCreate: function getOrCreateService(login) {

    return Group.findOneByName("Unknown").then(function (grp) {
      return Worker.findOrCreate({login: login}, {login: login, auto_created: 1, group: grp.id});
    });

  }

}

module.exports = WorkerCacheService;
