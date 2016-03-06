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

  describe('#get', function () {


    beforeEach(function () {

    });

    afterEach(function () {

    });

    it('should return promise with ObjectId', function () {
    });

  });
});
