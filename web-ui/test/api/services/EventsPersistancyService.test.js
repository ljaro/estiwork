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
    "user_login": "randomLogin",
    "user_sid" : "1111-22222"
  },
  "sample": {
    "image_fs_name": "app.exe"
  },
  "machine" : {
    "machine_sid" : "3823284-82384-2389482"
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
      s1 = sinon.stub(WorkerCacheService, 'getOrCreate').returns(Q.resolve(""));
      s2 = sinon.stub(AppCategoryService, 'get').returns(Q.resolve({name:'Web Browsers', type:'PRODUCTIVE'}));
      s3 = sinon.stub(Event, 'create').returns(Q.resolve(1));
      s4 = sinon.stub(WorkstationCacheService, 'getOrCreate').returns(Q.resolve('111'));
    });

    afterEach(function () {
      sinon.sandbox.restore();
      s1.restore();
      s2.restore();
      s3.restore();
      s4.restore();
    });


    it('should reject when WorkerCacheService return undefined promise', function () {
      s1.restore();
      s1 = sinon.stub(WorkerCacheService, 'getOrCreate').returns(Q.resolve(undefined));
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
      return expect(s1).to.have.been.calledWith(TPL.user.user_login, TPL.user.user_sid);
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

    it('should reject when one of promises throw', function () {
      s4.restore();
      s4 = sinon.stub(WorkstationCacheService, 'getOrCreate').returns(Q.resolve(null));
      var p = EventsPersistancyService.accept(message);
      return expect(p).to.be.rejected;
    });

    it('should reject when WorkerCacheService.get fails', function () {
      s1.restore();
      s1 = sinon.stub(WorkerCacheService, 'getOrCreate').returns(Q.reject(''));
      var p = EventsPersistancyService.accept(message);
      return expect(p).to.be.rejected;
    });

    it('should reject when AppCategoryService.get fails', function () {
      s2.restore();
      s2 = sinon.stub(AppCategoryService, 'get').returns(Q.reject(''));
      var p = EventsPersistancyService.accept(message);
      expect(p).to.be.rejected;
    });

    it('should persist msg with worker_id and app_category and workstation_id', function () {
      s1.restore();
      s2.restore();

      const worker_id = {id:'11111-22222-33333'};
      const app_cat   = {name:'Web Browsers', type:'PRODUCTIVE'};

      s1 = sinon.stub(WorkerCacheService, 'getOrCreate').returns(Q.resolve(worker_id));
      s2 = sinon.stub(AppCategoryService, 'get').returns(Q.resolve(app_cat));

      var msg = JSON.parse(JSON.stringify(TPL)); //copy
      msg['worker_id'] = worker_id.id;
      msg['app_category'] = app_cat.type;
      msg['workstation_id'] = '111';

      return EventsPersistancyService.accept(message).then(function () {
        sinon.assert.calledWith(s3, msg);
      });
    });

    it('should have appropriate properties', function () {
      s1.restore();
      s2.restore();

      const worker_id = {id:'11111-22222-33333'};
      const app_cat   = {name:'Web Browsers', type:'PRODUCTIVE'};

      s1 = sinon.stub(WorkerCacheService, 'getOrCreate').returns(Q.resolve(worker_id));
      s2 = sinon.stub(AppCategoryService, 'get').returns(Q.resolve(app_cat));

      var msg = JSON.parse(JSON.stringify(TPL)); //copy
      msg['worker_id'] = worker_id.id;
      msg['app_category'] = app_cat.type;
      msg['workstation_id'] = '111';

      return EventsPersistancyService.accept(message).then(function () {
        sinon.assert.calledWith(s3,
          sinon.match.has("worker_id", msg.worker_id)
            .and(sinon.match.has("app_category", app_cat.type))
            .and(sinon.match.has("app_category", app_cat.type))
            .and(sinon.match.has("workstation_id", msg.workstation_id))
        );
      });
    });

  });
});
