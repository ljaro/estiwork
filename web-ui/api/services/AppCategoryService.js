/* 
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

var Q = require('q');
var ObjectId = require('mongodb').ObjectId;

var AppCategoryService = {


  get: function getService(sample) {
    var strContains = function (str, hash) {
      return hash.indexOf(str) != -1;
    };
    
    var strEquals = function (str, value) {
      return str === value;
    };

    var strEndsWith = function (str, value) {
      return str.endsWith(value);
    };

    var returnTest = function (str, value) {
      value = new RegExp(value);
      return value.test(str);
    };

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
            if (rank[cat._id] === undefined) rank[cat._id] = 0;
              switch (sig.func) {
                case "strContains":
                  rank[cat._id] += strContains(sample[sig.name], sig.hash) === true ? sig.weight : 0;
                  break;
                case "strEquals":
                  rank[cat._id] += strEquals(sample[sig.name], sig.value) === true ? sig.weight : 0;
                  break;
                case "strEndsWith":
                  rank[cat._id] += strEndsWith(sample[sig.name], sig.value) === true ? sig.weight : 0;
                  break;
                case "returnTest":
                  rank[cat._id] += returnTest(sample[sig.name], sig.value) === true ? sig.weight : 0;
                  break;  
                default:
                  console.log("This signature has unknown func property");
                  break
              };
            //rank[cat._id] += sig.func(sample[sig.name], sig.value) === true ? sig.weight : 0;
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
