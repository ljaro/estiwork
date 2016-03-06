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

var amq = require('amqplib');

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

describe('RabbitConsumerService', function () {

  describe('#createConnection', function () {

    var persistancySrv, stub_amq;

    var message = {
      fields: null,
      properties: null,
      content: new Buffer(JSON.stringify(TPL))
    };
    //
    //beforeEach(function () {
    //  persistancySrv = sinon.stub(EventsPersistancyService, 'accept');
    //});
    //
    //afterEach(function () {
    //  sinon.sandbox.restore();
    //  persistancySrv.restore();
    //  //stub_amq.restore();
    //});

    it('should create channel on connection success', function () {

      //var conn = sinon.stub(, "createChannel");
      //stub_amq = sinon.stub(amq, 'connect').returns(Q.resolve(conn));
      //RabbitConsumerService.createConnection(persistancySrv);
      //expect(conn).to.be.called;
    });

    it('should reconnect on connection fail', function () {
    });

    it('should consume on channel success', function () {
    });

    it('should reconnect on channel fail', function () {
    });

    it('should ack on message stored in db', function () {
    });

    it('should reconnect when consume fail', function () {
    });

    it('should retry consume on not acked messages', function () {
    });
  });
});
