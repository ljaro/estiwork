/**
 * New node file
 */
angular.module('myApp.myFilters', []).

filter('secondsToDateTime', [function() {
    return function(seconds) {
    	
 
    	var sec_num = parseInt(seconds, 10); // don't forget the second param
    	var hours   = Math.floor(sec_num / 3600);
    	var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    	var seconds = sec_num - (hours * 3600) - (minutes * 60);

    	if (hours   < 10) {hours   = hours;}
    	if (minutes < 10) {minutes = "0"+minutes;}
    	if (seconds < 10) {seconds = "0"+seconds;}
    	
    	var time    = '';
    	
    	if(hours>0)
    		time+=hours+'h ';
    	
    	if(minutes>0)
    		time += minutes+' min';
    	
    	if(minutes == 0 && hours == 0)
    		time = "-";
    	
    	return time;
    	
    };
}]).
filter('secondsToDateTimeStr1', [function() {
    return function(seconds) {
    	
 
    	var sec_num = parseInt(seconds, 10); // don't forget the second param
    	var hours   = Math.floor(sec_num / 3600);
    	var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    	var seconds = sec_num - (hours * 3600) - (minutes * 60);

    	if (hours   < 10) {hours   = "0"+hours;}
    	if (minutes < 10) {minutes = "0"+minutes;}
    	if (seconds < 10) {seconds = "0"+seconds;}
    	var time    = hours+':'+minutes+':'+seconds;
    	return time;
    	
    };
}]).
filter('chkEmpty', [function() {
    return function(some) {
    	if(some)
    		return some;
    	else
    		return "brak";
    };
}])
.
filter('inkb', [function() {
    return function(kilobytes) {
    	
    	return ""+kilobytes+" kB"
    };
}])