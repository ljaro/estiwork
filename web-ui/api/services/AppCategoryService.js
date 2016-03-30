/**
 * Created by luk on 2016-03-05.
 */

var Q = require('q');

var AppCategoryService = {


  get: function getService(sample) {
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
            if (rank[cat.id] === undefined) rank[cat.id] = 0;
            rank[cat.id] += sig.func(sample[sig.name]) === true ? sig.weight : 0;

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
        return x.id == max_id;
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
