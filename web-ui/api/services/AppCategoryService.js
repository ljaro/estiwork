/* 
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

var Q = require('q');
var ObjectId = require('mongodb').ObjectId;

var AppCategoryService = {


  get: function getService(sample) {

    var comparator = {

      "strContains" : function (str, value) {
          return value.indexOf(str) != -1;
        },    
      "strEquals" : function (str, value) {
          return str === value;
        },
      "strEndsWith" : function (str, value) {
          return str.endsWith(value);
        },
      "returnTest": function (str, value) {
          value = new RegExp(value);
          return value.test(str);
        }

    }

    function __findAppSig(sample, cats) {
      var rank = {};

      if (sample.resource_image_name === '' || sample.resource_image_name === undefined) {
        sample.resource_image_name = sample.image_fs_name;
      }

      if (sample.resource_image_name !== sample.image_fs_name) {
        console.log('Match dropped with reason: sample.resource_image_name !== sample.image_fs_name');
        return {type: 'NONPRODUCTIVE'};
      }

      cats.forEach(function (cat) {
        cat.signatures.forEach(function (sig) {
          if (sample[sig.name] !== undefined) {
            rank[cat._id] = rank[cat._id] || 0;
            if (sig.func) {
              var func = comparator[sig.func];
              rank[cat._id] += func(sample[sig.name], sig.value) === true ? sig.weight : 0;
            } else {
              console.log("This signature has unknown func property");
            }

            //TODO add to logs important!
            // console.log(cat.name+' with id:'+cat.id+' has '+rank[cat.id]+' pts.');
          }
        });
      });

      var max = 0;
      var max_id;
      Object.keys(rank).forEach(function (id) {
        if (rank[id] > max) {
          max = rank[id];
          max_id = id;
        }
      });

      var result = cats.filter(function (x) {
        return x._id == max_id;
      });

      if (result.length > 0) {
        return result[0];
      }

      return {type: 'NONPRODUCTIVE'};
    }

    try {
      //TODO getOrCreate used means that creating app signatures mode enabled.
      // Use get to disable auto creating signatures
      return AppsCacheService.getOrCreate(sample).then(function (cats) {
        var result = __findAppSig(sample, cats);
        return Q.fcall(function () {
          return result;
        });
      });

    } catch (exception) {
      return Q.nfcall(function () {
        console.log('AppCategoryService raise: ' + exception.message);
        return undefined;
      });
    }

  }

}

module.exports = AppCategoryService;
