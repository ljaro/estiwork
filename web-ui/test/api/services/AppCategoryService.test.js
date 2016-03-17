"use strict";

var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
var sinonChai = require("sinon-chai");
chai.use(chaiAsPromised);
chai.use(sinonChai);
var sinon = require('sinon');
var Q = require('q');


var TPL = {
  "user": {
    "user_login": "randomLogin"
  }
};
/**
 *
 * @type {*[]}
 */
var samplesFirefox = [
  {
    "window_caption": "RabbitMQ Management - Mozilla Firefox",
    "image_fs_name": "firefox.exe",
    "image_full_path": "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe",
    "resource_image_name": "firefox.exe"
  },
  {
    "window_caption": "XXXXXXXXXXXXXXX - Mozilla Firefox",
    "image_fs_name": "firefox.exe",
    "image_full_path": "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe",
    "resource_image_name": "firefox.exe"
  },
  {
    "window_caption": "XXXXXXXXXXXXXX - Mozilla Firefox XXXXXXXXXX",
    "image_fs_name": "firefox.exe",
    "image_full_path": "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe",
    "resource_image_name": "firefox.exe"
  }
]

var cats = [
  {
    id: 1,
    name: 'Chrome',
    group: 'Web browser',

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
    md5: [],

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
    md5: [],

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
]

function findAppSig(sample) {
  var rank = {};

  if (sample.resource_image_name === '' || sample.resource_image_name === undefined) {
    sample.resource_image_name = sample.image_fs_name;
  }

  if (sample.resource_image_name !== sample.image_fs_name) {
    return 'Invalid'
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
    return result[0].name;
  }

  return undefined;
}

describe('AppCategoryService', function () {

  describe('#matching', function () {

    beforeEach(function () {
    });

    afterEach(function () {
    });

    it('matching test firefox examples', function () {
      samplesFirefox.forEach(function (sample) {
        var res = findAppSig(sample);
        assert.equal(res, 'Firefox');
      });
    });

    it('md5 should have priority over caption and res_name', function () {
      var sample = {
        "window_caption": "RabbitMQ Management - Google Chrome",
        "image_fs_name": "firefox.exe",
        "image_full_path": "C:\\Program Files (x86)\\Opera\\firefox.exe",
        "resource_image_name": "firefox.exe",
        "md5": '333333'
      }

      var res = findAppSig(sample);
      assert.equal(res, 'Opera');
    });

    it('resource_name should have priority over caption', function () {
      var sample = {
        "window_caption": "RabbitMQ Management - Google Chrome",
        "image_fs_name": "firefox.exe",
        "image_full_path": "C:\\Program Files (x86)\\Opera\\opera.exe",
        "resource_image_name": "firefox.exe"
      }

      var res = findAppSig(sample);
      assert.equal(res, 'Firefox');
    });

    it('caption should have lower priority then resource_name', function () {
      var sample = {
        "window_caption": "RabbitMQ Management - Mozilla Firefox",
        "image_fs_name": "chrome.exe",
        "image_full_path": "C:\\Program Files (x86)\\Mozilla Firefox\\opera.exe",
        "resource_image_name": "chrome.exe"
      }

      var res = findAppSig(sample);
      assert.equal(res, 'Chrome');
    });

    it('resouce_name should have lower priority then md5', function () {
    });

    it('image_fs_name and image_full_path should be used when no resource_name', function () {
      var sample = {
        "window_caption": "RabbitMQ Management - Google Chrome",
        "image_fs_name": "chrome.exe",
        "image_full_path": "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe",
        "resource_image_name": ""
      }

      var res = findAppSig(sample);
      assert.equal(res, 'Chrome');
    });

    it('should detect when image_fs_name or image_full_path is in odd directory', function () {
      // hard to code, optional
      // consider removing usage
    });

    it('should detect when image_fs_name or image_full_path has odd names', function () {
      // hard to code, optional
      // consider removing usage
      var sample = {
        "window_caption": "RabbitMQ Management - Google Chrome",
        "image_fs_name": "firefox.exe",
        "image_full_path": "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe",
        "resource_image_name": "chrome.exe"
      }

      var res = findAppSig(sample);
      assert.equal(res, 'Invalid');
    });

  });
});
