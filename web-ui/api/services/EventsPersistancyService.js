/**
 * Created by luk on 2016-02-22.
 */

var Q = require('q');

var EventsPersistancyService = {
  accept: function acceptService(msg) {

    var worker_id = WorkerCacheService.get('some login');
    var app_category = AppCategoryService.get('some');

    var p = Q.all([worker_id, app_category]).then(function () {
      var content = msg.content.toString();
      content = JSON.parse(content);
      return Event.create(content);
    });

    return p;
  }
}

module.exports = EventsPersistancyService;
