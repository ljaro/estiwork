/**
 * Created by luk on 2016-03-19.
 */

var Q = require('q');

var WorkstationCacheService = {
  findIdBySid: function findIdBySidService(sid) {
    return Q.fcall(function () {
      return 100;
    })
  }
}


module.exports = WorkstationCacheService;
