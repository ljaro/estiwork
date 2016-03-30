/**
 * Created by luk on 2016-03-05.
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



    var cats = [

      {
        "id" : new ObjectId("56facede9ea8cea11329a5fd"),
        "name" : "Chrome",
        "group" : "Web browser",
        "type" : "PRODUCTIVE",
        "signatures" : [
          {
            "name" : "hash",
            "weight" : 100.0000000000000000,
            "hash" : [
              "056781731eaf223c799bebe04c60353ea73d60cb"
            ],
            "func" : function (str) {
              return this.hash.indexOf(str) != -1;
            }
          },
          {
            "name" : "resource_image_name",
            "weight" : 7.0000000000000000,
            "func" : function (str) {
              return str === "chrome.exe";
            }
          },
          {
            "name" : "window_caption",
            "weight" : 5.0000000000000000,
            "func" : function (str) {
              return str.endsWith("- Google Chrome");
            }
          },
          {
            "name" : "image_fs_name",
            "weight" : 2.0000000000000000,
            "func" : function (str) {
              return str === "chrome.exe";
            }
          },
          {
            "name" : "image_full_path",
            "weight" : 2.0000000000000000,
            "func" : function (str) {
              return str.endsWith("chrome.exe");
            }
          }
        ]
      },
      {
        "id" : new ObjectId("56faceee9ea8cea11329a5fe"),
        "name" : "Firefox",
        "group" : "Web browser",
        "type" : "NONPRODUCTIVE",
        "signatures" : [
          {
            "name" : "hash",
            "weight" : 100.0000000000000000,
            "hash" : [
              "10e596c10b5364d13a8b89a68f0ee14a27626554"
            ],
            "func" : function (str) {
              return this.hash.indexOf(str) != -1;
            }
          },
          {
            "name" : "resource_image_name",
            "weight" : 7.0000000000000000,
            "func" : function (str) {
              return str === "firefox.exe";
            }
          },
          {
            "name" : "window_caption",
            "weight" : 5.0000000000000000,
            "func" : function (str) {
              return str.endsWith("- Mozilla Firefox");
            }
          },
          {
            "name" : "image_fs_name",
            "weight" : 2.0000000000000000,
            "func" : function (str) {
              return str === "firefox.exe";
            }
          },
          {
            "name" : "image_full_path",
            "weight" : 2.0000000000000000,
            "func" : function (str) {
              return str.endsWith("firefox.exe");
            }
          }
        ]
      },
      {
        "id" : new ObjectId("56fb9fc79ea8cea11329a601"),
        "name" : "RabbitMQ Management",
        "group" : "Web browser",
        "type" : "PRODUCTIVE",
        "signatures" : [
          {
            "name" : "hash",
            "weight" : 100.0000000000000000,
            "hash" : [
              "10e596c10b5364d13a8b89a68f0ee14a27626554"
            ],
            "func" : function (str) {
              return this.hash.indexOf(str) != -1;
            }
          },
          {
            "name" : "resource_image_name",
            "weight" : 7.0000000000000000,
            "func" : function (str) {
              return str === "firefox.exe";
            }
          },
          {
            "name" : "window_caption",
            "weight" : 8.0000000000000000,
            "func" : function (str) {
              return /.*RabbitMQ Management - Mozilla Firefox/.test(str);
            }
          },
          {
            "name" : "image_fs_name",
            "weight" : 2.0000000000000000,
            "func" : function (str) {
              return str === "firefox.exe";
            }
          },
          {
            "name" : "image_full_path",
            "weight" : 2.0000000000000000,
            "func" : function (str) {
              return str.endsWith("firefox.exe");
            }
          }
        ]
      },
      {
        "id" : new ObjectId("56facefc9ea8cea11329a5ff"),
        "name" : "Opera",
        "group" : "Web browser",
        "type" : "NONPRODUCTIVE",
        "signatures" : [
          {
            "name" : "hash",
            "weight" : 100.0000000000000000,
            "hash" : [
              "333333",
              "33333"
            ],
            "func" : function (str) {
              return this.hash.indexOf(str) != -1;
            }
          },
          {
            "name" : "resource_image_name",
            "weight" : 7.0000000000000000,
            "func" : function (str) {
              return str === "opera.exe";
            }
          },
          {
            "name" : "window_caption",
            "weight" : 5.0000000000000000,
            "func" : function (str) {
              return str.endsWith("- Opera");
            }
          },
          {
            "name" : "image_fs_name",
            "weight" : 2.0000000000000000,
            "func" : function (str) {
              return str === "opera.exe";
            }
          },
          {
            "name" : "image_full_path",
            "weight" : 2.0000000000000000,
            "func" : function (str) {
              return str.endsWith("opera.exe");
            }
          }
        ]
      },
      {
        "id" : new ObjectId("56facf0a9ea8cea11329a600"),
        "name" : "Prod. app on Opera",
        "group" : "Work apps",
        "type" : "PRODUCTIVE",
        "signatures" : [
          {
            "name" : "hash",
            "weight" : 100.0000000000000000,
            "hash" : [
              "333333",
              "33333"
            ],
            "func" : function (str) {
              return this.hash.indexOf(str) != -1;
            }
          },
          {
            "name" : "resource_image_name",
            "weight" : 7.0000000000000000,
            "func" : function (str) {
              return str === "opera.exe";
            }
          },
          {
            "name" : "window_caption",
            "weight" : 8.0000000000000000,
            "func" : function (str) {
              return /.*?Prod. app on Opera - Opera/.test(str);
            }
          },
          {
            "name" : "image_fs_name",
            "weight" : 2.0000000000000000,
            "func" : function (str) {
              return str === "opera.exe";
            }
          },
          {
            "name" : "image_full_path",
            "weight" : 2.0000000000000000,
            "func" : function (str) {
              return str.endsWith("opera.exe");
            }
          }
        ]
      }
    ];

    return Q.fcall(function () {
      return cats;
    });

    //return Apps.find({});
  }

}

module.exports = AppsCacheService;
