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
  },
  "sample": {
    "image_fs_name": "app.exe"
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

    it('should reject when WorkerCacheService return undefined promise', function () {
      s1.restore();
      s1 = sinon.stub(WorkerCacheService, 'get').returns(Q.resolve(undefined));
      var res = EventsPersistancyService.accept(message);
      return expect(res).to.be.rejected;
    });

    it('should reject when AppCategoryService return undefined promise', function () {
      s2.restore();
      s2 = sinon.stub(AppCategoryService, 'get').returns(Q.resolve(undefined));
      var res = EventsPersistancyService.accept(message);
      return expect(res).to.be.rejected;
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

    it('should call Event.create when all is ok', function () {
      return EventsPersistancyService.accept(message).then(function () {
        sinon.assert.calledOnce(s3);
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

    it('should persist msg with worker_id and app_category', function () {
      s1.restore();
      s2.restore();

      const worker_id = '11111-22222-33333';
      const app_cat   = 'PROD';

      s1 = sinon.stub(WorkerCacheService, 'get').returns(Q.resolve(worker_id));
      s2 = sinon.stub(AppCategoryService, 'get').returns(Q.resolve(app_cat));

      var msg = JSON.parse(JSON.stringify(TPL)); //copy
      msg['worker_id'] = worker_id;
      msg['app_category'] = app_cat;

      return EventsPersistancyService.accept(message).then(function () {
        sinon.assert.calledWith(s3, msg);
      });
    });

  });
});
