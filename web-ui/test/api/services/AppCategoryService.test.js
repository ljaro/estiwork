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





describe('AppCategoryService', function () {

  describe('#matching', function () {

    beforeEach(function () {
    });

    afterEach(function () {
    });

    it('md5 should have priority over caption and res_name', function () {
      var sample = {
        "window_caption": "RabbitMQ Management - Google Chrome",
        "image_fs_name": "firefox.exe",
        "image_full_path": "C:\\Program Files (x86)\\Opera\\firefox.exe",
        "resource_image_name": "firefox.exe",
        "hash": '333333'
      }

      var res = AppCategoryService.get(sample).then(function (obj) {
        return obj.name;
      });
      return expect(res).to.eventually.equals('Opera');
    });

    it('resource_name should have priority over caption', function () {
      var sample = {
        "window_caption": "RabbitMQ Management - Google Chrome",
        "image_fs_name": "firefox.exe",
        "image_full_path": "C:\\Program Files (x86)\\Opera\\opera.exe",
        "resource_image_name": "firefox.exe"
      }

      var res = AppCategoryService.get(sample).then(function (obj) {
        return obj.name;
      });
      return expect(res).to.eventually.equals('Firefox');
    });

    it('caption should have higher priority when rest of properties match', function () {
      var sample = {
        "window_caption": "RabbitMQ Management - Mozilla Firefox",
        "image_fs_name": "firefox.exe",
        "image_full_path": "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe",
        "resource_image_name": "firefox.exe"
      }

      var res = AppCategoryService.get(sample).then(function (obj) {
        return obj.name;
      });
      return expect(res).to.eventually.equals('RabbitMQ Management');
    });

    it('caption should have lower priority then resource_name', function () {
      var sample = {
        "window_caption": "koasdkoasodoasodkao - Mozilla Firefox",
        "image_fs_name": "chrome.exe",
        "image_full_path": "C:\\Program Files (x86)\\Mozilla Firefox\\opera.exe",
        "resource_image_name": "chrome.exe"
      }

      var res = AppCategoryService.get(sample).then(function (obj) {
        return obj.name;
      });
      return expect(res).to.eventually.equals('Chrome');
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

      var res = AppCategoryService.get(sample).then(function (obj) {
        return obj.name;
      });
      return expect(res).to.eventually.equals('Chrome');
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

      var res = AppCategoryService.get(sample).then(function (obj) {
        return obj.name;
      });
      return expect(res).to.eventually.equals(undefined);
    });

    describe('#Web browser applications distinct', function () {

      beforeEach(function () {
      });

      afterEach(function () {
      });

      it('web browser app2', function () {
        var sample = {
          "window_caption": "Gazeta.pl - Opera",
          "image_fs_name": "opera.exe",
          "image_full_path": "C:\\Program Files (x86)\\Opera\\opera.exe",
          "resource_image_name": "opera.exe"
        }

        var res = AppCategoryService.get(sample).then(function (obj) {
          return obj.type;
        });
        return expect(res).to.eventually.equals('NONPRODUCTIVE');
      });

      //TODO add md5 tests (need to implement injecting sig into AppCategoryService)
      it('web browser app2', function () {
        var sample = {
          "window_caption": "Gazeta.pl - Opera",
          "image_fs_name": "opera.exe",
          "image_full_path": "C:\\Program Files (x86)\\Opera\\opera.exe",
          "resource_image_name": "opera.exe"
        }

        var res = AppCategoryService.get(sample).then(function (obj) {
          return obj.type;
        });
        return expect(res).to.eventually.equals('NONPRODUCTIVE');
      });

      it('web browser app3', function () {
        var sample = {
          "window_caption": "Prod. app on Opera - Opera",
          "image_fs_name": "opera.exe",
          "image_full_path": "C:\\Program Files (x86)\\Opera\\opera.exe",
          "resource_image_name": "opera.exe"
        }

        var res = AppCategoryService.get(sample).then(function (obj) {
          return obj.name;
        });
        return expect(res).to.eventually.equals('Prod. app on Opera');
      });

      it('should match with respect of case sensitivity', function () {
        var sample = {
          "window_caption": "xxxxx Prod. app on opera - Opera",
          "image_fs_name": "opera.exe",
          "image_full_path": "C:\\Program Files (x86)\\Opera\\opera.exe",
          "resource_image_name": "opera.exe"
        }

        var res = AppCategoryService.get(sample).then(function (obj) {
          return obj.name;
        });
        return expect(res).to.eventually.equals('Opera');
      });

      it('should match with prefix', function () {
        var sample = {
          "window_caption": "xxxxx Prod. app on Opera - Opera",
          "image_fs_name": "opera.exe",
          "image_full_path": "C:\\Program Files (x86)\\Opera\\opera.exe",
          "resource_image_name": "opera.exe"
        }

        var res = AppCategoryService.get(sample).then(function (obj) {
          return obj.name;
        });
        return expect(res).to.eventually.equals('Prod. app on Opera');
      });

      it('should match when resource name is wrong', function () {
        var sample = {
          "window_caption": "Prod. app on Opera - Opera",
          "image_fs_name": "chrome.exe",
          "image_full_path": "C:\\Program Files (x86)\\Opera\\opera.exe",
          "resource_image_name": "chrome.exe"
        }

        var res = AppCategoryService.get(sample).then(function (obj) {
          return obj.name;
        });
        return expect(res).to.eventually.equals('Prod. app on Opera');
      });

      it('should match md5', function () {
        var sample = {
          "window_caption": "Prod. app on Opera - Oper1a",
          "image_fs_name": "chrome.exe",
          "image_full_path": "C:\\Program Files (x86)\\Opera\\opera.exe",
          "resource_image_name": "chrome.exe",
          "hash":"333333"
        }

        var res = AppCategoryService.get(sample).then(function (obj) {
          return obj.name;
        });
        return expect(res).to.eventually.equals('Opera');
      });


    });


  });
});
