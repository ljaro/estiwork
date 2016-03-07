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


describe('WorkerCacheService', function () {

  describe('#get', function () {

    var s1, s2, s3;
    var worker = {"login": "test"};
    beforeEach(function () {
      s1 = sinon.stub(Worker, 'findOneByLogin').returns(Q.resolve(worker));
      s2 = sinon.stub(Worker, 'create').returns(Q.resolve(worker));
      s3 = sinon.stub(Worker, 'findOrCreate').returns(Q.resolve(worker));
    });

    afterEach(function () {
      s1.restore();
      s2.restore();
      s3.restore();
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
      s1.restore();
      s1 = sinon.stub(Worker, 'findOneByLogin').returns(Q.resolve(null));
      var p = WorkerCacheService.getOrCreate(worker.login);
      return expect(p).to.eventually.become(worker);
    });
  });
});
