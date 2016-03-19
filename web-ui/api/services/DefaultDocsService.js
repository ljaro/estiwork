/**
 * Created by luk on 2016-03-07.
 */

var Q = require('q');

var DefaultDocsService = {
  initializeDatabase: function initializeDatabaseService() {


    var q1 =
      [
        Workstation.native(function (err, collection) {
          return collection.createIndex({"machine_sid": 1}, {unique: 1});
        }),


        Group.findOrCreate({name: 'Unknown'}, {name: 'Unknown'}),

        
        Worker.native(function (err, collection) {
          return collection.createIndex({
            "login": 1,
            "user_sid": 1
          }, {unique: 1});
        })
      ];

    return Q.all(q1);


  }
}

module.exports = DefaultDocsService;
