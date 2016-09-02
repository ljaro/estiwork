/**
 * 
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * 
 * WorkerController
 *
 * @description :: Server-side logic for managing workers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const ObjectId = require('sails-mongo').mongo.objectId;
var assert = require('assert');
var startTimer = false;


module.exports = {

<<<<<<< HEAD
=======

>>>>>>> master
  post: function (req, res) {

    var trimmedText = req.body["text"].trim();

    if (trimmedText.length > 0 && !startTimer) {
      startTimer = true;

      if (trimmedText.length > 1000){
        trimmedText = trimmedText.substr(0, 999);
      }

      var newEntry = {};
      newEntry.text = trimmedText;

      Feedback.create(newEntry).exec(function(err, data){
        if (err) { return res.serverError(err) }
        res.send(data);
      });

      setTimeout(function(){startTimer = false}, 5000);
    } else {
      res.send("Your feedback was not added. Wait for 5 seconds and add it again.");      
    }

  }

};

