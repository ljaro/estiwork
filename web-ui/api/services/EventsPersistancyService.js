/**
 * Created by luk on 2016-02-22.
 */

var Q = require('q');
var util = require('util');

var EventsPersistancyService = {
  accept: function acceptService(msg) {

    try {
      var content = msg.content.toString();
      content = JSON.parse(content);

      var worker_id = WorkerCacheService.getOrCreate(content.user.user_login, content.user.user_sid);
      var app_category = AppCategoryService.get(content.sample.image_fs_name);

      var p = Q.all([worker_id, app_category]).then(function (res) {

        if (util.isNullOrUndefined(res[0]) || util.isNullOrUndefined(res[1])) {
          throw new Error('Time:' + content.probe_time + ', worker_id or app_category is undefined');
        }

        content['worker_id'] = res[0].id;
        content['app_category'] = res[1];
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
