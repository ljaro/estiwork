/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

var Q = require('q');

var DefaultDocsService = {
  initializeDatabase: function initializeDatabaseService() {


    console.log('init database');
    var q1 =
      [
        Workstation.native(function (err, collection) {
          if(err){
            console.log(err);
          }
          return collection.createIndex({"machine_sid": 1}, {unique: 1});
        }),


        Group.findOrCreate({name: 'Unknown'}, {name: 'Unknown'}),
        Group.findOrCreate({name: 'Unknown1'}, {name: 'Unknown1'}),
        Group.findOrCreate({name: 'Unknown2'}, {name: 'Unknown2'}),
        Group.findOrCreate({name: 'Unknown3'}, {name: 'Unknown3'}),
        Group.findOrCreate({name: 'Unknown4'}, {name: 'Unknown4'}),


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
