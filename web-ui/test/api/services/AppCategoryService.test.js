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





describe('AppCategoryService', function () {

  describe('#matching', function () {

    beforeEach(function () {
    });

    afterEach(function () {
    });

    it('matching test firefox examples', function () {
      var operations = samplesFirefox.map(AppCategoryService.get);
      return Q.all(operations).then(function (res) {
        res.forEach(function (value) {
          assert.equal(value.name, 'Firefox');
        });
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

    it('caption should have lower priority then resource_name', function () {
      var sample = {
        "window_caption": "RabbitMQ Management - Mozilla Firefox",
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
      return expect(res).to.eventually.equals('Invalid');
    });

  });
});
