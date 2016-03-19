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
var ObjectId = require('mongodb').ObjectId;

describe('WorkerCacheService', function () {

  describe('#get', function () {

    var s1, s2, s3, s4;
    var worker = {"user_login": "test", "user_sid":"1111-22222", "user_info":"this is user info"};
    var group = {
      "id" : new ObjectId(),
      "name" : "Unknown",
      "createdAt" : Date("2016-02-19T19:09:36.913Z"),
      "updatedAt" : Date("2016-02-19T19:09:37.778Z")
    }

    beforeEach(function () {
      s1 = sinon.stub(Worker, 'findOneByLogin').returns(Q.resolve(worker));
      s2 = sinon.stub(Worker, 'create').returns(Q.resolve(worker));
      s3 = sinon.stub(Worker, 'findOrCreate').returns(Q.resolve(worker));
      s4 = sinon.stub(Group, 'findOneByName').returns(Q.resolve(group));
    });

    afterEach(function () {
      s1.restore();
      s2.restore();
      s3.restore();
      s4.restore();
    });

    it('should return promise with ObjectId when found for getService', function () {
      var p = WorkerCacheService.get('login1', 'user_sid');
      return expect(p).to.eventually.become(worker);
    });

    it('should return null when worker not found for getService', function () {
      s1.restore();
      s1 = sinon.stub(Worker, 'findOneByLogin').returns(Q.resolve(null));
      var p = WorkerCacheService.get('login1', 'user_sid');
      return expect(p).to.eventually.become(null);
    });

    it('should return found if found for getOrCreateService', function () {
      var p = WorkerCacheService.getOrCreate(worker);
      return expect(p).to.eventually.become(worker);
    });

    it('should return newly created if not found for getOrCreateService', function () {
      var p = WorkerCacheService.getOrCreate(worker);
      return expect(p).to.eventually.become(worker);
    });

    it('should return newly created with property auto_created', function () {
      return WorkerCacheService.getOrCreate(worker).then(function () {
        sinon.assert.calledWith(
          s3,
          {login: worker.user_login, user_sid:worker.user_sid},
          sinon.match.has("group", group.id)
            .and(sinon.match.has("user_sid", worker.user_sid))
            .and(sinon.match.has("info", worker.user_info))
            .and(sinon.match.has("auto_created", 1).or(sinon.match.has("auto_created", "true"))));

      }, function () {
        assert.fail();
      });
    });

    it('should retry find until found or create', function () {
      var err = new Error;
      err['originalError'] = {'code': 11000};

      s3.restore();
      s3 = sinon.stub(Worker, 'findOrCreate');
      s3.onCall(0).returns(Q.reject(err));
      s3.onCall(1).returns(Q.reject(err));
      s3.onCall(2).returns(Q.resolve(worker));

      return WorkerCacheService.getOrCreate(worker).then(function () {
        expect(s3).calledThrice
      }, function () {
        assert.fail();
      });
    });

    it('should not retry if error different then duplicate keys', function () {
      var err = new Error;
      err['originalError'] = {'code': 0};

      s3.restore();
      s3 = sinon.stub(Worker, 'findOrCreate');
      s3.onCall(0).returns(Q.reject(err));
      s3.onCall(1).returns(Q.reject(err));
      s3.onCall(2).returns(Q.resolve(worker));

      return WorkerCacheService.getOrCreate(worker).then(function () {
        assert.fail()
      }, function () {
        expect(s3).calledOnce;
      });
    });

    it('should not retry if error different then duplicate keys2', function () {
      var err = new Error;

      s3.restore();
      s3 = sinon.stub(Worker, 'findOrCreate');
      s3.onCall(0).returns(Q.reject(err));
      s3.onCall(1).returns(Q.reject(err));
      s3.onCall(2).returns(Q.resolve(worker));

      return WorkerCacheService.getOrCreate(worker).then(function () {
        assert.fail()
      }, function () {
        expect(s3).calledOnce;
      });
    });

  });
});
