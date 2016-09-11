/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

var Q = require('q');

var DefaultDocsService = {
  initializeDatabase: function initializeDatabaseService() {


    console.log('init database');
    var q1 =
      [
        Workstation.native(function (err, collection) {
          if(err){
            console.log(err);
          }
          return collection.createIndex({"machine_sid": 1}, {unique: 1});
        }),


        Group.findOrCreate({name: 'Unknown'}, {name: 'Unknown'}),
        Group.findOrCreate({name: 'Unknown1'}, {name: 'Unknown1'}),
        Group.findOrCreate({name: 'Unknown2'}, {name: 'Unknown2'}),
        Group.findOrCreate({name: 'Unknown3'}, {name: 'Unknown3'}),
        Group.findOrCreate({name: 'Unknown4'}, {name: 'Unknown4'}),


        Worker.native(function (err, collection) {
          return collection.createIndex({
            "login": 1,
            "user_sid": 1
          }, {unique: 1});
        })
      ];

    this.populateAppSignatures();

    return Q.all(q1);

  },

  populateAppSignatures: function populateAppSignatures() {
    var cats = [
      { "name" : "Chrome",
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
    for (i = 0; i < cats.length; i++) {
      Apps.findOrCreate(cats[i]).exec(function createFindCB(error, createdOrFoundRecords){
//        console.log('Not added '+createdOrFoundRecords.name+'!');
      });
    }

  }

}

module.exports = DefaultDocsService;
