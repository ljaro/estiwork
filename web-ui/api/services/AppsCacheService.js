/* 
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

var Q = require('q');
var ObjectId = require('mongodb').ObjectId;

//TODO: refactoring what should I do to add new field to user model.. write down every point
var AppsCacheService = {

  getOrCreate: function getOrCreateService(sample) {

    //
    // var create = {
    //   'name': sample.resource_image_name,
    //   'group': 'default',
    //   'type': 'UNPRODUCTIVE',
    //   'signatures': [
    //     {
    //       'name': 'hash',
    //       'weight': 100,
    //       'hash': [sample.hash],
    //       'func': function (str) {
    //         return this.hash.indexOf(str) != -1
    //       }
    //     },
    //     {
    //       "name": 'resource_image_name',
    //       "weight": 7,
    //       "func": function (str) {
    //         return str === sample.resource_image_name;
    //       }
    //     },
    //     {
    //       "name": 'window_caption',
    //       "weight": 5,
    //       "func": function (str) {
    //         return str.endsWith('- <fill in>');
    //       }
    //     },
    //     {
    //       "name": 'image_fs_name',
    //       "weight": 2,
    //       "func": function (str) {
    //         return str === sample.resource_image_name;
    //       }
    //     },
    //     {
    //       "name": 'image_full_path',
    //       "weight": 2,
    //       "func": function (str) {
    //         return str.endsWith(sample.resource_image_name);
    //       }
    //     }
    //   ]
    // };

    var cats;

    return cats = Q.promise(function(resolve, reject){

      Apps.native(function(err, collection) {
        if (err) reject(err);
        collection.find({}, {
          name: true,
          type: true, 
          group: true, 
          signatures: []
        }).toArray(function (err, results) {
          if (err) reject(err);
          return resolve(results);    

        });
      });

    });

  }

}

module.exports = AppsCacheService;
  