'use strict';

/**
 * Created by luk on 2015-08-22.
 */


//var assert = require("assert");
//require("moment-duration-format");

var customMatchers = {
  toEqualData: function(util, customTester){

    return {
      compare: function(actual, expected) {
        return angular.equals(actual, expected);
      }
    }
  }
}

//
//tryby
//- godziny
//- minuty
//- godziny i minuty
//- dni i godziny
//- dni i godziny i minuty
//

describe('myApp.myFilters', function() {

  beforeEach(function(){
    jasmine.addMatchers(customMatchers);
  });

  beforeEach(module('myApp.myFilters'));


  describe('seconds to hours', function(){
    it('has sec2h filter', function($filter){
      expect($filter('sec2h')).not.toBeNull();
    });

    it('0 sec should return \"0h\"', inject(function ($filter) {
      expect($filter('sec2h')(0)).toEqual("0h");
    }));

    it('full range check sec should return reverse result', inject(function ($filter) {

      for(var i=0;i<100;i+=60*50)
      {
        var result = $filter('sec2h')(i);
        var sign = result.substr(result.length-1);

        expect(sign).toEqual("h");

        var reversed_result = result.substr(0, result.length-1);
        reversed_result = reversed_result * 60 * 60; // into seconds;

        expect(reversed_result).toEqual(i);
      }
    }));

  });

  describe('seconds to minutes', function(){
    it('has sec2m filter', function($filter){
      expect($filter('sec2m')).not.toBeNull();
    });

    it('0 sec should return \"0m\"', inject(function ($filter) {
      expect($filter('sec2m')(0)).toEqual("0m");
    }));

    it('full range check sec should return reverse result', inject(function ($filter) {

      for(var i=0;i<100;i+=60*50)
      {
        var result = $filter('sec2m')(i);
        var sign = result.substr(result.length-1);

        expect(sign).toEqual("m");

        var reversed_result = result.substr(0, result.length-1);
        reversed_result = reversed_result * 60;// into seconds

        expect(reversed_result).toEqual(i);
      }
    }));

  });

  describe('seconds to minutes and hours', function(){
    it('has sec2hm filter', function($filter){
      expect($filter('sec2hm')).not.toBeNull();
    });

    it('0 sec should return \"0h 0m\"', inject(function ($filter) {
      var res = $filter('sec2hm')(0);
      expect(res).toEqual("0h 0m");
    }));

    it('full range check sec should return reverse result', inject(function ($filter) {

      for(var i=0;i<100;i+=60*50)
      {
        var result = $filter('sec2hm')(i);
        var h = result.split("h")[0].trim();
        var m = result.split("h")[1].split("m")[0].trim();

        var reversed_result = (h*60*60) + (m*60);
        expect(reversed_result).toEqual(i);
      }
    }));
  });


  describe('seconds to days and hours', function(){
    it('has sec2dh filter', function($filter){
      expect($filter('sec2dh')).not.toBeNull();
    });

    it('0 sec should return \"0d 0h\"', inject(function ($filter) {
      expect($filter('sec2dh')(0)).toEqual("0d 0h");
    }));

    it('full range check sec should return reverse result', inject(function ($filter) {

      for(var i=0;i<100;i+=60*50)
      {
        var result = $filter('sec2dh')(i);
        var d = result.split("d")[0].trim();
        var h = result.split("d")[1].split("h")[0].trim();


        var reversed_result = (d*24*60*60) + (h*60*60);
        expect(reversed_result).toEqual(i);
      }
    }));
  });


  describe('seconds to days, hours, minutes', function(){
    it('has sec2dhm filter', function($filter){
      expect($filter('sec2dhm')).not.toBeNull();
    });

    it('0 sec should return \"0d 0h\"', inject(function ($filter) {
      expect($filter('sec2dhm')(0)).toEqual("0d 0h 0m");
    }));

    it('full range check sec should return reverse result', inject(function ($filter) {

      for(var i=0;i<100;i+=60*50)
      {
        var result = $filter('sec2dhm')(i);
        var d = result.split("d")[0].trim();
        var h = result.split("d")[1].split("h")[0].trim();
        var m = result.split("d")[1].split("h")[1].split("m")[0].trim();


        var reversed_result = (d*24*60*60) + (h*60*60) + (m*60);
        expect(reversed_result).toEqual(i);
      }
    }));
  });
});