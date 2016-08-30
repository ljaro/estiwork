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
var ObjectId = require('mongodb').ObjectId;
var assert = require('assert');


module.exports = {


  post: function (req, res) {

    var data = req.body;
    var newdata = [];

    var newentry = {};
    newentry.text = data['text'];
    newdata.push(newentry);
    
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

