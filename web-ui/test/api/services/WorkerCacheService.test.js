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
    var worker = {"login": "test"};
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
      var p = WorkerCacheService.get('login1');
      return expect(p).to.eventually.become(worker);
    });

    it('should return null when worker not found for getService', function () {
      s1.restore();
      s1 = sinon.stub(Worker, 'findOneByLogin').returns(Q.resolve(null));
      var p = WorkerCacheService.get('login1');
      return expect(p).to.eventually.become(null);
    });

    it('should return found if found for getOrCreateService', function () {
      var p = WorkerCacheService.getOrCreate('login1');
      return expect(p).to.eventually.become(worker);
    });

    it('should return newly created if not found for getOrCreateService', function () {
      var p = WorkerCacheService.getOrCreate(worker.login);
      return expect(p).to.eventually.become(worker);
    });

    it('should return newly created with property auto_created', function () {
      var login = worker.login;
      return WorkerCacheService.getOrCreate(login).then(function () {
        sinon.assert.calledWith(s3, {login: login}, sinon.match.has("group", group.id).and(sinon.match.has("auto_created", 1).or(sinon.match.has("auto_created", "true"))));
      }, function () {
        assert.fail();
      });
    });
  });
});
