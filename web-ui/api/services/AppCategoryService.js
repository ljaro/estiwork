/**
 * Created by luk on 2016-03-05.
 */

var Q = require('q');

var AppCategoryService = {
  get: function getService(signature) {

    var deffered = Q.defer();

    setTimeout(function () {
      deffered.resolve('res');
      //deffered.reject('err');
    }, 500);

    return deffered.promise;

  }
}

module.exports = AppCategoryService;
