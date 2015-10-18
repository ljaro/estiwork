/**
 * QuickviewController
 *
 * @description :: Server-side logic for managing quickviews
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	


  /**
   * `QuickviewController.getGroup()`
   */
  getGroup: function (req, res) {
	  
	  Event.native(function(err, collection) {
	  if (err) return res.serverError(err);
	  
		collection.aggregate([
			{
				$match:
				{ 
					probe_time: 
					{
						$gte: new Date(new Date().setHours(0,0,0,0))
					}        
				}        
			},
			{
				$sort:{probe_time:1}
			},
			{
				$group:
				{
					_id:{wid:"$worker_id", grp:"$group"},
					"login_datetime":{$min: {$cond: [ {$eq:["$user.presence", 'active']},"$probe_time", new Date("2215-04-25T00:00:00")] }},
					"logout_datetime":
					{
						$max: 
						{ 
							$cond: [
									{
										$lt:["$probe_time", new Date()]
									}, 
									{$add:["$probe_time", {$multiply:["$duration", 1000]} ]}, 
									0] 
						}
					},
					"total_logged_time":{$sum: "$duration"},
					"total_break_time":{$sum: {$cond: [ {$eq:["$user.work_mode", 'break']},"$duration", 0] }},
					"total_idle_time":{$sum: {$cond: [ {$eq:["$user.presence", 'idle']},"$duration", 0] }},
					"total_pro_apps_time":{$sum: {$cond: [ {$eq:["$app_category", 'productive']},"$duration", 0] }},   
					"total_nonpro_apps_time":{$sum: {$cond: [ {$ne:["$app_category", 'productive']},"$duration", 0] }},
					"current_app":{$last:"$sample"},
					"custom_1":{$sum: {$cond: [ {$eq:["$user.work_mode", 'CUSTOM_1']},"$duration", 0] }},
					"custom_2":{$sum: {$cond: [ {$eq:["$user.work_mode", 'CUSTOM_2']},"$duration", 0] }},
					"custom_3":{$sum: {$cond: [ {$eq:["$user.work_mode", 'CUSTOM_3']},"$duration", 0] }},
					"custom_4":{$sum: {$cond: [ {$eq:["$user.work_mode", 'CUSTOM_4']},"$duration", 0] }},
					
					"leader_name":{$last:"$leader_name"},
					"print_qty":{$last:"$print_qty"},
					"total_downloads_size":{$last:"$total_downloads_size"},
					"workstation":{$last:"$workstation"},
					"effectiveness":{$last:"$effectiveness"}

				}
			},
			{
				$project:
				{
					"login_datetime":1,
					"logout_datetime":1,
					"total_logged_time":1,
					"total_break_time":1,
					"total_idle_time":1,
					"total_pro_apps_time":1,
					"total_nonpro_apps_time":1,
					"current_app":1,
					"custom_1":1,
					"custom_2":1,
					"custom_3":1,
					"custom_4":1,
					"worker_name":"$_id.wid",
					
					"leader_name":1,
					"print_qty":1,
					"leader_name":1,
					"print_qty":1,
					"total_downloads_size":1,
					"workstation":1,
					"effectiveness":1
				}
			},
			{
				$group:
				{
						_id:"$_id.grp",
						data:{$push: "$$ROOT"}
				}
			},
			
		]).toArray(function (err, results) {
			if (err) 
				return res.serverError(err);
			
			return res.ok(results);
		});
	
	  
	  
	  });

  }
};
