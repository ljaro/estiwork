/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
var Q = require('q');
var util = require('util');

var EventsPersistancyService = {
  accept: function acceptService(msg) {

    try {
      var content = msg.content.toString();
      content = JSON.parse(content);

      var promises = [
        WorkerCacheService.getOrCreate(content.user),
        AppCategoryService.get(content.sample),
        WorkstationCacheService.getOrCreate(content.machine.machine_sid)
      ];

      var p = Q.all(promises).then(function (res) {

        res.forEach(function (p) {
          if(util.isNullOrUndefined(p)){
            throw new Error('Time:' + content.probe_time + ', worker_id or app_category is undefined');
          }
        });

        content['worker_id'] = res[0].id;
        content['app_category'] = res[1].type;
        content['workstation_id'] = res[2];

        content['app_info'] = {
          'name':res[1].name,
          'type':res[1].type,
          'group':res[1].group,
        };

        // group id at event creation time
        content['group'] = res[0].group;

        return Event.create(content);
      });

      return p;
    }
    catch (e) {
      return Q.nfcall(function () {
        throw new Error(e);
      })
    }

  }
}

module.exports = EventsPersistancyService;
