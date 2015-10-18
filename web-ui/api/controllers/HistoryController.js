/**
 * HistoryController
 *
 * @description :: Server-side logic for managing histories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {
	


  /**
   * `HistoryController.getGroupInRange()`
   */
  getGroupInRange: function (req, res) {
	  
	Event.native(function(err, collection) {
	  if (err) return res.serverError(err);

	  collection.aggregate([
	              {
	                  $match:
	                  { 
	                      probe_time: 
	                      {
	                          $gte: new Date(req.params.from), 
	                          $lt: new Date(req.params.to)
	                      }        
	                  }        
	              },
	              {
	                  $group:
	                  {
	                      _id:{worker_id:"$worker_id", group:"$group"},
	                      "total_logged_time":{$sum: "$duration"},
	                      "total_break_time":{$sum: {$cond: [ {$eq:["$user.work_mode", 'break']},"$duration", 0] }},
	                      "total_nonidle_duration":{$sum: {$cond: [ {$eq:["$user.presence", 'active']},"$duration", 0] }},
	                      "total_idle_time":{$sum: {$cond: [ {$eq:["$user.presence", 'idle']},"$duration", 0] }},   
	                      "total_pro_apps_time":{$sum: {$cond: [ {$eq:["$app_category", 'productive']},"$duration", 0] }},   
	                      "total_nonpro_apps_time":{$sum: {$cond: [ {$ne:["$app_category", 'productive']},"$duration", 0] }},
	                      "status1":{$sum: {$cond: [ {$eq:["$user.work_mode", 'CUSTOM_1']},"$duration", 0] }},
	                      "status2":{$sum: {$cond: [ {$eq:["$user.work_mode", 'CUSTOM_2']},"$duration", 0] }},
	                      "status3":{$sum: {$cond: [ {$eq:["$user.work_mode", 'CUSTOM_3']},"$duration", 0] }},
	                      "status4":{$sum: {$cond: [ {$eq:["$user.work_mode", 'CUSTOM_4']},"$duration", 0] }},
	                      
	                      "leader_name":{$last:"$leader_name"},
	                  }
	              },
	              {
	                  $project:
	                  {                        
	                      "total_logged_time":1,
	                      "total_break_time":1,
	                      "total_nonidle_duration":1,
	                      "total_idle_time":1,
	                      "total_pro_apps_time": 1,
	                      "total_nonpro_apps_time" : 6388,
	                      "print_qty":1,
	                      "medium_print_qty":1,
	                      "medium_download_size":1,
	                      "effectivity":1,
	                      "status1":1,
	                      "status2":1,
	                      "medium_break_time": { $multiply:[3600, {$divide:["$total_break_time", "$total_logged_time"]} ] },
//	                      "medium_break_time": {$divide:["$total_break_time", "$total_logged_time"]},
	                      "worker_name":"$_id.worker_id",
	                      "leader_name":1
	                  }
	              },
	              {
	            	  $group:
	            	  {
	            		  _id:"$_id.group",
	                      data:{$push: "$$ROOT"}
	            	  }
	              }
	          ]).toArray(function (err, results) {
		if (err) return res.serverError(err);
		return res.ok(results);
	  });
	});
  }
};
