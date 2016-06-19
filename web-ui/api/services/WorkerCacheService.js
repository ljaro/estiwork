/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

var Q = require('q');

//TODO: refactoring what should I do to add new field to user model.. write down every point
var WorkerCacheService = {
  get: function getService(login, usersid) {
    return Worker.findOneByLogin({login: login, user_sid: usersid});
  },

  getOrCreate: function getOrCreateService(user) {

    var login = user.user_login;
    var usersid = user.user_sid;

    function __findOrCreateWorker(grp) {
      var findCrit = {
        login: login,
        user_sid: usersid
      };

      var createCrit = {
        login: login,
        user_sid: usersid,
        info: user.user_info,
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

    var test_groups = ['Unknown', 'Unknown1', 'Unknown2', 'Unknown3', 'Unknown4'];


    return Group.findOneByName(test_groups[Math.floor((Math.random() * 5))]).then(function (grp) {
      return __findOrCreateWorker(grp);
    });

  }

}

module.exports = WorkerCacheService;
