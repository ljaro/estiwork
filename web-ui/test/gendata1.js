/**
 * Created by luk on 2015-11-20.
 */




var persons = Array.apply(0, Array(10)).map(function(x, y){

  var start_day = moment('2015-11-01');

  var days = Array.apply(0, Array(30)).map(function(xx, yy) {
    var day = start_day.clone().add(yy, 'days').startOf('day').toISOString();

    var template = {
      day: day,
      schedule: [
        {duration: {h: 2}, work_mode: 'work', app_category: 'productive', presence:'idle'},
        {duration: {m: 30}, work_mode: 'break', app_category: 'nonproductive', presence:'active'},
        {duration: {h: 2}, work_mode: 'work', app_category: 'productive', presence:'active'},
        {duration: {h: 2}, work_mode: 'work', app_category: 'productive', presence:'active'},
        {duration: {h: 2}, work_mode: 'work', app_category: 'productive', presence:'active'},
      ]
    };
    return template;
  });

  return days;
});
