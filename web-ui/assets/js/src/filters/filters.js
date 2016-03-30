/**
 * New node file
 */
angular.module('myApp.myFilters', []).

  filter('secondsToDateTime', [function () {
    return function (seconds) {


      var sec_num = parseInt(seconds, 10); // don't forget the second param
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (hours < 10) {
        hours = hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      var time = '';

      if (hours > 0)
        time += hours + 'h ';

      if (minutes > 0)
        time += minutes + 'min';

      if (minutes == 0 && hours == 0)
        time = "-";

      return time;

    };
  }]).
  filter('secondsToDateTimeStr1', [function () {
    return function (seconds) {


      var sec_num = parseInt(seconds, 10); // don't forget the second param
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return hours + ':' + minutes + ':' + seconds;

    };
  }]).
  filter('chkEmpty', [function () {
    return function (some) {
      if (some)
        return some;
      else
        return "brak";
    };
  }])
  .
  filter('inkb', [function () {
    return function (kilobytes) {

      if (kilobytes !== null)
        return "" + kilobytes + " kB";
      else
        return "";
    };
  }]).
  filter('sec2h', [function () {

    return function (sec) {

      return moment.duration(sec, 'seconds').format('h[h]', {trim: false});

    }
  }]).
  filter('sec2m', [function () {

    return function (sec) {

      return moment.duration(sec, 'seconds').format('m[m]', {trim: false});
    }
  }]).
  filter('sec2hm', [function () {

    return function (sec) {

      return moment.duration(sec, 'seconds').format('D[h] m[m]', {trim: false});
    }
  }]).
  filter('sec2dh', [function () {

    return function (sec) {

      return moment.duration(sec, 'seconds').format('d[d] h[h]', {trim: false});
    }
  }]).
  filter('sec2dhm', [function () {

    return function (sec) {
      return moment.duration(sec, 'seconds').format('d[d] h[h] m[m]', {trim: false});
    }
  }]).
filter('truncDots', [function () {

  return function (str) {
    const maxstrlen = 10;

    if(str.length>maxstrlen){
      return str.substr(0, maxstrlen-3)+'...';
    }else{
      return str;
    }
  }
}]).
filter('cutExe', [function () {

  return function (str) {
    const maxstrlen = 10;

    if(str.endsWith('.exe')){
      return str.substr(0, str.length-4);
    }else{
      return str;
    }
  }
}]);

