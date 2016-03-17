/**
 * Created by luk on 2016-03-05.
 */

var Q = require('q');


var cats = [
  {
    id: 1,
    name: 'Chrome',
    group: 'Web browser',
    type: 'PRODUCTIVE',

    signatures: [
      {
        "name": 'md5',
        "weight": 100,
        "func": function (str) {
          return ['111111'].indexOf(str) != -1;
        }
      },
      {
        "name": 'resource_image_name',
        "weight": 7,
        "func": function (str) {
          return str === 'chrome.exe';
        }
      },
      {
        "name": 'window_caption',
        "weight": 5,
        "func": function (str) {
          return str.endsWith('- Google Chrome');
        }
      },
      {
        "name": 'image_fs_name',
        "weight": 2,
        "func": function (str) {
          return str === 'chrome.exe';
        }
      },
      {
        "name": 'image_full_path',
        "weight": 2,
        "func": function (str) {
          return str.endsWith('chrome.exe');
        }
      }
    ]
  },
  {
    id: 2,
    name: 'Firefox',
    group: 'Web browser',
    type: 'PRODUCTIVE',

    signatures: [
      {
        "name": 'md5',
        "weight": 100,
        "func": function (str) {
          return ['222222'].indexOf(str) != -1;
        }
      },
      {
        "name": 'resource_image_name',
        "weight": 7,
        "func": function (str) {
          return str === 'firefox.exe';
        }
      },
      {
        "name": 'window_caption',
        "weight": 5,
        "func": function (str) {
          return str.endsWith('- Mozilla Firefox');
        }
      },
      {
        "name": 'image_fs_name',
        "weight": 2,
        "func": function (str) {
          return str === 'firefox.exe';
        }
      },
      {
        "name": 'image_full_path',
        "weight": 2,
        "func": function (str) {
          return str.endsWith('firefox.exe');
        }
      }
    ]
  },
  {
    id: 3,
    name: 'Opera',
    group: 'Web browser',
    type: 'PRODUCTIVE',

    signatures: [
      {
        "name": 'md5',
        "weight": 100,
        "func": function (str) {
          return ['333333'].indexOf(str) != -1;
        }
      },
      {
        "name": 'resource_image_name',
        "weight": 7,
        "func": function (str) {
          return str === 'opera.exe';
        }
      },
      {
        "name": 'window_caption',
        "weight": 5,
        "func": function (str) {
          return str.endsWith('- Opera');
        }
      },
      {
        "name": 'image_fs_name',
        "weight": 2,
        "func": function (str) {
          return str === 'opera.exe';
        }
      },
      {
        "name": 'image_full_path',
        "weight": 2,
        "func": function (str) {
          return str.endsWith('opera.exe');
        }
      }
    ]
  }
];

var AppCategoryService = {


  get: function getService(sample) {


    function __findAppSig(sample) {
      var rank = {};

      if (sample.resource_image_name === '' || sample.resource_image_name === undefined) {
        sample.resource_image_name = sample.image_fs_name;
      }

      if (sample.resource_image_name !== sample.image_fs_name) {
        return {name:'Invalid', type:'NONPRODUCTIVE'};
      }

      cats.forEach(function (cat) {
        cat.signatures.forEach(function (sig) {
          if (sample[sig.name] !== undefined) {
            if (rank[cat.id] === undefined) rank[cat.id] = 0;
            rank[cat.id] += sig.func(sample[sig.name]) === true ? sig.weight : 0;
          }
        });
      });

      var max = 0;
      var max_id;
      Object.keys(rank).forEach(function (x) {
        if (rank[x] > max) {
          max = rank[x];
          max_id = x;
        }
      });

      var result = cats.filter(function (x) {
        return x.id == max_id;
      });

      if (result.length > 0) {
        return result[0];
      }

      return {name:'Invalid', type:'NONPRODUCTIVE'};
    }

    try {
      var result = __findAppSig(sample);
      return Q.fcall(function () {
        return result;
      });

    } catch (exception) {
      return Q.nfcall(function () {
        return undefined;
      });
    }

  }
}

module.exports = AppCategoryService;
