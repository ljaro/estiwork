/**
 *
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * 
 * HistoryController
 *
 * @description :: Server-side logic for managing histories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var ObjectId = require('mongodb').ObjectId;
var assert = require('assert');


//TODO very ugly query to refactor
module.exports = {


  /**
   * `HistoryController.getGroupInRange()`
   */
  getGroupInRange: function (req, gres) {

    console.log(req.params);

    Group.find({name: {$in: req.params.id.split(',')}})
      .populate('workers')
      .exec(function (err, found) {

        if (err) return gres.serverError(err);

        var workers = [];

        found.forEach(function (x) {
          x.workers.forEach(function (xx) {
            workers.push(xx.id);
          });
        });

        workers = workers.map(function (x) {
          return new ObjectId(x);
        });

        Event.native(function (err, collection) {
          if (err) return gres.serverError(err);

          var query = [
            {
              $match: {
                probe_time: {
                  $gte: new Date(req.params.from),
                  $lt: new Date(req.params.to)
                },
                worker_id: {
                  $in: workers
                }
              }
            },
            {
              $group: {
                _id: {worker_id: "$worker_id", group: "$group"},
                "total_logged_time": {$sum: "$duration"},
                "total_break_time": {$sum: {$cond: [{$eq: ["$user.work_mode", 'BREAK']}, "$duration", 0]}},
                "total_nonidle_duration": {$sum: {$cond: [{$eq: ["$user.presence", 'ACTIVE']}, "$duration", 0]}},
                "total_idle_time": {$sum: {$cond: [{$eq: ["$user.presence", 'IDLE']}, "$duration", 0]}},
                "total_pro_apps_time": {$sum: {$cond: [{$eq: ["$app_category", 'PRODUCTIVE']}, "$duration", 0]}},
                "total_nonpro_apps_time": {$sum: {$cond: [{$ne: ["$app_category", 'PRODUCTIVE']}, "$duration", 0]}},
                "status1": {$sum: {$cond: [{$eq: ["$user.work_mode", 'CUSTOM_1']}, "$duration", 0]}},
                "status2": {$sum: {$cond: [{$eq: ["$user.work_mode", 'CUSTOM_2']}, "$duration", 0]}},
                "status3": {$sum: {$cond: [{$eq: ["$user.work_mode", 'CUSTOM_3']}, "$duration", 0]}},
                "status4": {$sum: {$cond: [{$eq: ["$user.work_mode", 'CUSTOM_4']}, "$duration", 0]}},

                "leader_name": {$last: "$leader_name"},
              }
            },
            {
              $project: {
                "total_logged_time": 1,
                "total_break_time": 1,
                "total_nonidle_duration": 1,
                "total_idle_time": 1,
                "total_pro_apps_time": 1,
                "total_nonpro_apps_time": 6388,
                "print_qty": 1,
                "medium_print_qty": 1,
                "medium_download_size": 1,
                "effectivity": 1,
                "status1": 1,
                "status2": 1,
                "medium_break_time": {$multiply: [3600, {$divide: ["$total_break_time", "$total_logged_time"]}]},
//	                      "medium_break_time": {$divide:["$total_break_time", "$total_logged_time"]},
                "worker_name": "$_id.worker_id",
                "leader_name": 1
              }
            },
            {
              $group: {
                _id: "$_id.group",
                data: {$push: "$$ROOT"}
              }
            }
          ];


          // console.log(JSON.stringify(query));
          //  var cur = collection.aggregate(query);

          // console.log(cur.explain('executionStats'));

          collection.aggregate(query).toArray(function (err, results) {
            if (err) return res.serverError(err);

            Worker.find({_id: {$in: workers}})
              .populate('leader')
              .exec(function (err, res) {

                results.map(function (x, y) {
                  x.data.map(function (xx, yy) {

                    var tmpLead = res.find(function (x) {
                      return xx._id.worker_id.equals(x.id);
                    });

                    xx.leader_name = tmpLead ? tmpLead.leader ? tmpLead.leader.login || "-" : "-" : "-"

                    var tmpWorker = res.find(function (x) {
                      return xx._id.worker_id.equals(x.id);
                    })

                    xx.worker_name = tmpWorker ? tmpWorker.login || "-" : "-";

                  })
                });


                return gres.ok(results);
              });

          });
        });

      });


  }
};

