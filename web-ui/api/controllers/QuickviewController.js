/**
 *
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * QuickviewController
 *
 * @description :: Server-side logic for managing quickviews
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require('moment');
//var ObjectId = require('mongodb').ObjectId;
const ObjectId = require('sails-mongo').mongo.objectId;

module.exports = {


  /**
   * `QuickviewController.getGroup()`
   */
  getGroup: function (req, res) {

    Event.native(function (err, collection) {
      if (err) return res.serverError(err);


      var d1 = new Date(new Date().setHours(0, 0, 0, 0));
      //console.log(d1.toISOString());

      var d2 = moment().startOf('day').toDate();
      //console.log(d2.toISOString());

      var groupsFilter = req.params['id'].split(',');

      groupsFilter = groupsFilter.map(function (x) {
        return  new ObjectId(x);
      });

      var query = [
        {
          $match: {
            probe_time: {
              $gt: new Date(new Date().setHours(0, 0, 0, 0))
            },
            group: {$in:groupsFilter}
          }
        },
        {
          $sort: {probe_time: 1}
        },
        {
          $group: {
            _id: {wid: "$worker_id", grp: "$group"},
            //"login_datetime": {$min: {$cond: [{$eq: ["$user.presence", 'active']}, "$probe_time", new Date("2215-04-25T00:00:00")]}},
            "login_datetime": {$min: "$probe_time"},
            "logout_datetime": {
              $max: {
                $cond: [
                  {
                    $lt: ["$probe_time", new Date()]
                  },
                  {$add: ["$probe_time", {$multiply: ["$duration", 1000]}]},
                  0]
              }
            },
            "total_logged_time": {$sum: "$duration"},
            "total_break_time": {$sum: {$cond: [{$eq: ["$user.work_mode", 'BREAK']}, "$duration", 0]}},
            "total_idle_time": {$sum: {$cond: [{$and: [{$ne: ["$user.work_mode", 'BREAK']}, {$eq: ["$user.presence", 'IDLE']}]}, "$duration", 0]}},
            "total_pro_apps_time": {$sum: {$cond: [{$eq: ["$app_category", 'PRODUCTIVE']}, "$duration", 0]}},
            "total_nonpro_apps_time": {$sum: {$cond: [{$and: [{$ne: ["$user.work_mode", 'BREAK']}, {$ne: ["$app_category", 'PRODUCTIVE']}]}, "$duration", 0]}},
            "current_app": {$last: "$sample"},
            "current_app_info": {$last: "$app_info"},
            "last_app_cat": {$last: "$app_category"},
            "custom_1": {$sum: {$cond: [{$eq: ["$user.work_mode", 'CUSTOM_1']}, "$duration", 0]}},
            "custom_2": {$sum: {$cond: [{$eq: ["$user.work_mode", 'CUSTOM_2']}, "$duration", 0]}},
            "custom_3": {$sum: {$cond: [{$eq: ["$user.work_mode", 'CUSTOM_3']}, "$duration", 0]}},
            "custom_4": {$sum: {$cond: [{$eq: ["$user.work_mode", 'CUSTOM_4']}, "$duration", 0]}},

            "leader_name": {$last: "$leader_name"},
            "print_qty": {$last: "$print_qty"},
            "total_downloads_size": {$last: "$total_downloads_size"},
            "workstation_id": {$last: "$workstation_id"},
            "effectiveness": {$last: "$effectiveness"},

            "last_app_cat": {$last: "$app_category"}

          }
        },
        {
          $project: {
            "login_datetime": 1,
            "logout_datetime": 1,
            "total_logged_time": 1,
            "total_break_time": 1,
            "total_idle_time": 1,
            "total_pro_apps_time": 1,
            "total_nonpro_apps_time": 1,

            "current_app": {
              "window_caption": "$current_app.window_caption",
              "image_fs_name": "$current_app.image_fs_name",
              "image_full_path": "$current_app.image_full_path",
              "resource_image_name": "$current_app.resource_image_name",
              "app_category": "$last_app_cat",
              "app_info": "$current_app_info"
            },

            "custom_1": 1,
            "custom_2": 1,
            "custom_3": 1,
            "custom_4": 1,
            "worker_name": "$_id.wid",

            "leader_name": 1,
            "print_qty": 1,
            "leader_name": 1,
            "print_qty": 1,
            "total_downloads_size": 1,
            "workstation": {"workstation_id": "$workstation_id"},
            "effectiveness": 1
          }
        },
        {
          $group: {
            _id: "$_id.grp",
            data: {$push: "$$ROOT"}
          }
        },

      ];

      //console.log(JSON.stringify(query, null, 4));

      collection.aggregate(query).toArray(function (err, results) {
        if (err)
          return res.serverError(err);

        results.forEach(function (group) {
          group.data.map(function (person) {
            Workstation.findOne({id:person.workstation.workstation_id}).then(function (res) {
              person.workstation['name'] = res.name;
              person.workstation['machine_sid'] = res.machine_sid;
            })
          });
        });


        Worker.find({})
          .populate('leader')
          .populate('group')
          .exec(function (err, res2) {

            results.map(function (x, y) {
              x.data.map(function (xx, yy) {

                var tmpLeader = res2.find(function (x) {
                  return xx._id.wid.equals(x.id);
                });

                xx.leader_name = tmpLeader ? tmpLeader.leader ? tmpLeader.leader.login || "-" : "-" : "-"

                var tmpWorker = res2.find(function (x) {
                  return xx._id.wid.equals(x.id);
                });

                xx.worker_name = tmpWorker ? tmpWorker.login : "-";
                xx['worker_info'] = tmpWorker ? tmpWorker.info : "no info";
                x['name'] = tmpWorker.group.name;

              })
            });
            return res.ok(results);
          });


      });


    });

  }
};

// test1

