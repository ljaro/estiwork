/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * 
 * 
 * QuickviewController
 *
 * @description :: Server-side logic for managing quickviews
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	


  /**
   * `QuickviewController.getGroup()`
   */
  test1: function (req, res) {
	  
	  var response = "dummy";
	  
	  
	  Group.create({
		  name: 'grupa1'
	  }).then(function(newGrp){
		  
		  Worker.create({
			  login:'worker1',
			  group: newGrp.id			  
		  }).then(function(lid1){
			  
			  newGrp.workers = [lid1];
			  
			  Worker.create({
				  login:'worker2',
				  group: newGrp.id,
				  leader: lid1.id
			  }).then(function(wrk2){
				  lid1.workers = [wrk2];
				  lid1.save();
				  
				  newGrp.workers = [wrk2];				  				  
				  newGrp.save();
			  }).then(function(){
				  return Group.find(newGrp.id).populate('workers');
			  }).then(console.log)
				.catch(console.error);
		  })
	  })
	  
	  setTimeout(function() {
		  res.send(response);
	  }, 1000);

  }
};

