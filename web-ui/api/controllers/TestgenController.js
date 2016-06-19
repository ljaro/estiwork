/**
 * 
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * 
 * TestgenController
 *
 * @description :: Server-side logic for managing testgens
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var assert = require('assert');


module.exports = {
  post: function (req, res) {

    var data = req.body;
    var newdata = [];

    data.forEach(function(entry){
      var newentry = {};
      newentry.user = {};
      newentry.user.presence = entry['presence'];
      newentry.user.work_mode= entry['work_mode'];
      newentry.user.user_sid = entry['user_name'];
      newentry.user.user_login = entry['user_name'];
      newentry.worker_id = entry['user_name'];
      newentry.duration = entry['duration'];
      newentry.app_category = entry['app_category'];

      // na sztywno
      newentry.leader_name 			= 'Leszek Miller';
      newentry.print_qty 				= Math.floor(Math.random()*100);
      newentry.total_downloads_size	= Math.floor(Math.random()*10000); // w kB
      newentry.workstation 			= 'PTASZEK';
      newentry.effectiveness 			= 100;



//		console.log('-----------------------------------------------');
//		console.log(entry['probe_time']);
//		console.log(new Date(entry['probe_time']));
//		console.log('-----------------------------------------------');

      newentry.probe_time = new Date(entry['probe_time']);
      newentry.sample = {};
      newentry.sample['image_fs_name'] = entry['app_name'];
      newentry.sample['resource_image_name'] = '';
      newentry.sample['window_caption'] = '';
      newentry.sample['image_full_path'] = '';



      newdata.push(newentry);
      console.log(entry);
    });

    Event.native(function(err, collection){
      if (err) return res.serverError(err);

      collection.remove({});

      collection.insert(newdata, function(err, data){
        assert.equal(err, null);
        res.send(data);
      });

    });

  }
};

