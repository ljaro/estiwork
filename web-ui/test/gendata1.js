/**
 * Created by luk on 2015-11-20.
 */




var persons = Array.apply(0, Array(3)).map(function(x, y){

  var start_day = moment('2015-01-01');

  var days = Array.apply(0, Array(3)).map(function(xx, yy) {
    var day = start_day.clone().add(yy, 'days').startOf('day').toISOString();

    var template = {
      day: day,
      schedule: [
        {duration: {h: 2}, work_mode: 'work'},
        {duration: {h: 2}, work_mode: 'work'}
      ]
    };
    return template;
  });

  return days;
});
