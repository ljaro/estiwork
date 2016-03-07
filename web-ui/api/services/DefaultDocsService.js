/**
 * Created by luk on 2016-03-07.
 */

var Q = require('q');

var DefaultDocsService = {
  initializeDatabase: function initializeDatabaseService() {

    return Q.fcall(function () {
      return Group.findOrCreate({name:'Unknown'}, {name:'Unknown'});
    });

  }
}

module.exports = DefaultDocsService;
