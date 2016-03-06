"use strict";
//var Event = require('../../../api/models/Event');
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
  "probe_time": "2016-02-24T19:17:01",
  "duration": 2,
  "user": {
    "user_sid": "S-1-5-21-2242820312-3698568055-2602798999-1000",
    "user_login": "luk",
    "presence": "IDLE",
    "work_mode": "WORK_WITH_COMPUTER"
  },
  "machine": {
    "machine_sid": ""
  },
  "sample": {
    "window_caption": "localrpc_test_server (Debugging) - Microsoft Visual Studio",
    "image_fs_name": "devenv.exe",
    "image_full_path": "C:\\Program Files (x86)\\Microsoft Visual Studio 10.0\\Common7\\IDE\\devenv.exe",
    "resource_image_name": "devenv.exe"
  }
};

describe('EventsPersistancyService', function () {

  describe('#accept', function () {

    var s1, s2, s3, s4;

    var message = {
      fields: null,
      properties: null,
      content: new Buffer(JSON.stringify(TPL))
    };

    beforeEach(function () {
      s1 = sinon.stub(WorkerCacheService, 'get').returns(Q.resolve(""));
      s2 = sinon.stub(AppCategoryService, 'get').returns(Q.resolve(""));
      s3 = sinon.stub(Event, 'create').returns(Q.resolve(1));
    });

    afterEach(function () {
      sinon.sandbox.restore();
      s1.restore();
      s2.restore();
      s3.restore();
    });

    it('should return error when accept param is null', function () {
      var res = EventsPersistancyService.accept(null);
      return expect(res).to.be.rejected;
    });

    it('should return resolve promise on non error situation', function () {
      var res = EventsPersistancyService.accept(message);
      return expect(res).to.be.not.rejected;
    });

    it('should call WorkerCacheService to get worker_id', function () {
      EventsPersistancyService.accept(message);
      return expect(s1).to.have.been.calledOnce;
    });

    it('should call AppCategoryService to get app_category', function () {
      EventsPersistancyService.accept(message).then();
      return expect(s2).to.have.been.calledOnce;
    });

    it('should call Event.create when all if ok', function () {
      EventsPersistancyService.accept(message).then(function () {
        expect(s4).to.have.been.calledOnce;
      }, function () {
        expect(s4).to.have.been.calledOnce;
      });
    });

    it('should reject when Event.create reject', function () {
      s3.restore();
      s3 = sinon.stub(Event, 'create').returns(Q.reject(1));
      var p = EventsPersistancyService.accept(message);
      return expect(p).to.be.rejected;
    });

    it('should reject when Event.create throw', function () {
      var p = EventsPersistancyService.accept({});
      return expect(p).to.be.rejected;
    });

    it('should reject when WorkerCacheService.get fails', function () {
      s1.restore();
      s1 = sinon.stub(WorkerCacheService, 'get').returns(Q.reject(''));
      var p = EventsPersistancyService.accept(message);
      return expect(p).to.be.rejected;
    });

    it('should reject when AppCategoryService.get fails', function () {
      s2.restore();
      s2 = sinon.stub(AppCategoryService, 'get').returns(Q.reject(''));
      var p = EventsPersistancyService.accept(message);
      expect(p).to.be.rejected;
    });

  });
});
