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

describe('WorkstationCacheService', function () {

  describe('#get', function () {

    var s1, s2, s3, s4;
    var workstation = {"name": "test_workstation1", "machine_sid":"1111-22222-324234"};
    var group = {
      "id" : new ObjectId(),
      "name" : "Unknown",
      "createdAt" : Date("2016-02-19T19:09:36.913Z"),
      "updatedAt" : Date("2016-02-19T19:09:37.778Z")
    }

    beforeEach(function () {
      s1 = sinon.stub(Workstation, 'findOneByMachine_sid').returns(Q.resolve(workstation));
      s2 = sinon.stub(Workstation, 'create').returns(Q.resolve(workstation));
      s3 = sinon.stub(Workstation, 'findOrCreate').returns(Q.resolve(workstation));
    });

    afterEach(function () {
      s1.restore();
      s2.restore();
      s3.restore();
    });

    it('should return promise with ObjectId when found for getService', function () {
      var p = WorkstationCacheService.get('machine_sid');
      return expect(p).to.eventually.become(workstation);
    });

    it('should return null when workstation not found for getService', function () {
      s1.restore();
      s1 = sinon.stub(Workstation, 'findOneByMachine_sid').returns(Q.resolve(null));
      var p = WorkstationCacheService.get('machine_sid');
      return expect(p).to.eventually.become(null);
    });

    it('should return found if found for getOrCreateService', function () {
      var p = WorkstationCacheService.getOrCreate('machine_sid');
      return expect(p).to.eventually.become(workstation);
    });

    it('should return newly created if not found for getOrCreateService', function () {
      var p = WorkstationCacheService.getOrCreate(workstation.machine_sid);
      return expect(p).to.eventually.become(workstation);
    });

    it('should return newly created with property auto_created', function () {
      return WorkstationCacheService.getOrCreate(workstation.machine_sid).then(function () {
        sinon.assert.calledWith(
          s3,
          {machine_sid:workstation.machine_sid},
          sinon.match.has("name", workstation.machine_sid)
            .and(sinon.match.has("auto_created", 1).or(sinon.match.has("auto_created", "true"))));

      }, function () {
        assert.fail();
      });
    });

    it('should retry find until found or create', function () {
      var err = new Error;
      err['originalError'] = {'code': 11000};

      s3.restore();
      s3 = sinon.stub(Workstation, 'findOrCreate');
      s3.onCall(0).returns(Q.reject(err));
      s3.onCall(1).returns(Q.reject(err));
      s3.onCall(2).returns(Q.resolve(workstation));

      return WorkstationCacheService.getOrCreate(workstation.machine_sid).then(function () {
        expect(s3).calledThrice
      }, function () {
        assert.fail();
      });
    });

    it('should not retry if error different then duplicate keys', function () {
      var err = new Error;
      err['originalError'] = {'code': 0};

      s3.restore();
      s3 = sinon.stub(Workstation, 'findOrCreate');
      s3.onCall(0).returns(Q.reject(err));
      s3.onCall(1).returns(Q.reject(err));
      s3.onCall(2).returns(Q.resolve(workstation));

      return WorkstationCacheService.getOrCreate(workstation.machine_sid).then(function () {
        assert.fail()
      }, function () {
        expect(s3).calledOnce;
      });
    });

    it('should not retry if error different then duplicate keys2', function () {
      var err = new Error;

      s3.restore();
      s3 = sinon.stub(Workstation, 'findOrCreate');
      s3.onCall(0).returns(Q.reject(err));
      s3.onCall(1).returns(Q.reject(err));
      s3.onCall(2).returns(Q.resolve(workstation));

      return WorkstationCacheService.getOrCreate(workstation.machine_sid).then(function () {
        assert.fail()
      }, function () {
        expect(s3).calledOnce;
      });
    });

  });
});
