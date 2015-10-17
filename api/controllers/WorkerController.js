/**
 * WorkerController
 *
 * @description :: Server-side logic for managing workers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var ObjectId = require('mongodb').ObjectId
var assert = require('assert');


module.exports = {
	

  setWorkerParent: function (req, res) {
	Worker.native(function(err, collection) {
		  if (err) return res.serverError(err);

		 collection.updateOne(
		    // query 
		    {
		        "_id" : new ObjectId(req.params.id)
		    },
		    
		    // update 
		    {
		    	$set:{"parent": new ObjectId(req.body.parent)}
		    },
		    
		    // options 
		    {
		        "multi" : false,  // update only one document 
		        "upsert" : false  // insert a new document, if no existing document match the query 
		    }, function(err, data){
		    	assert.equal(err, null);
				res.send(data);
		    }
		);
	})
  },

  setWorkerlogin: function (req, res) {
	  Worker.native(function(err, collection) {
		  if (err) return res.serverError(err);

		 collection.updateOne(
		    // query 
		    {
		        "_id" : new ObjectId(req.params.id)
		    },
		    
		    // update 
		    {
		    	$set:{"login": req.body.login}
		    },
		    
		    // options 
		    {
		        "multi" : false,  // update only one document 
		        "upsert" : false  // insert a new document, if no existing document match the query 
		    }, function(err, data){
		    	assert.equal(err, null);
				res.send(data);
		    }
		);
	})
  },
    
  setWorkerFullname: function (req, res) {
	  Worker.native(function(err, collection) {
		  if (err) return res.serverError(err);

		 collection.updateOne(
		    // query 
		    {
		        "_id" : new ObjectId(req.params.id)
		    },
		    
		    // update 
		    {
		    	$set:{"fullname": req.body.fullname}
		    },
		    
		    // options 
		    {
		        "multi" : false,  // update only one document 
		        "upsert" : false  // insert a new document, if no existing document match the query 
		    }, function(err, data){
		    	assert.equal(err, null);
				res.send(data);
		    }
		);
	})
  },
  /**
   * `WorkerController.all()`
   */
  all: function (req, res) {	
    Worker.native(function(err, collection) {
	  if (err) return res.serverError(err);

	  collection.aggregate({$project:{id:"$_id", login:1, fullname:1, parent:1, level:1}}).
	  toArray(function (err, results) {
		if (err) return res.serverError(err);
		return res.ok(results);
	  });

  })},
  
  /**
   * `WorkerController.grouped()`
   */
  grouped: function (req, res) {	
  
	Worker.native(function(err, collection) {
	  if (err) return res.serverError(err);

	  collection.aggregate({$project:{id:"$_id", login:1, fullname:1, parent:1, level:1}}).
	  toArray(function (err, results) {
		if (err) return res.serverError(err);
		return res.ok(results);
	  });

  })},
  
  /**
   * `WorkerController.getWorkerData()`
   */
  getWorkerData: function (req, res) {	
    
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
	                        		},
	                        		worker_id: "Łukasz Sochaczewski"  /* <-------------------------------  HARD CODED*/
	                        	}
	                        },
	                        {
	                        	$group:
	                        	{ 
	                        		_id:{ dayOfYear: {$dayOfYear:"$probe_time"} },
	                        		"login_datetime":{$min: {$cond:   [ {$eq:["$user.presence", 'active']},"$probe_time", new Date("2215-04-25T00:00:00")] }},
	                        		"logout_datetime":{$last:  "$probe_time"},
	                        		"total_logged_time":{$sum: "$duration"},
	                        		"total_break_time":{$sum: {$cond: [ {$eq:["$user.work_mode", 'break']},"$duration", 0] }},
	                        		"total_idle_time":{$sum: {$cond: [ {$eq:["$user.presence", 'idle']},"$duration", 0] }},
	                        		"total_pro_apps_time":{$sum: {$cond: [ {$eq:["$app_category", 'productive']},"$duration", 0] }},   
	                        		"total_nonpro_apps_time":{$sum: {$cond: [ {$ne:["$app_category", 'productive']},"$duration", 0] }},
	                        		"total_nonidle_duration":{$sum: {$cond: [ {$eq:["$user.presence", 'active']},"$duration", 0] }},
	                        		"status1":{$sum: {$cond: [ {$eq:["$user.work_mode", 'CUSTOM_1']},"$duration", 0] }},
	                        		"status2":{$sum: {$cond: [ {$eq:["$user.work_mode", 'CUSTOM_2']},"$duration", 0] }},
	                        		"status3":{$sum: {$cond: [ {$eq:["$user.work_mode", 'CUSTOM_3']},"$duration", 0] }},
	                        		"status4":{$sum: {$cond: [ {$eq:["$user.work_mode", 'CUSTOM_4']},"$duration", 0] }}
	                        	}
	                        }
	                        ,
	                        {
	                        	$project:
	                        	{
	                        		_id:1,
	                        		"login_datetime":1,
	                        		"logout_datetime":1,
	                        		"total_logged_time":1,
	                        		"total_break_time":1,
	                        		"total_idle_time":1,
	                        		"total_nonidle_duration":1,
	                        		"total_nonpro_apps_time":1,
	                        		"total_pro_apps_time":1,
	                        		"status1":1,
	                        		"status2":1,
	                        		"status3":1,
	                        		"status4":1
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

