/**
 * Created by luk on 2015-11-18.
 */

var module = {};

load("../assets/node_modules/numeral/numeral.js");
load("../assets/node_modules/chance/chance.js");
load("../assets/node_modules/moment/moment.js");


var db = new Mongo().getDB("testdb1");
var col = db.getCollectionNames();

print('Script Mongo test start');



var period = [
  {duration: {h:2}, work_mode:'work' },
  {duration: {h:2}, work_mode:'work' }
];

var day2 = [
  '2h prod active',
  '3h prod idle',
  '1-3h '


];



var groups = Array.apply(0, Array(10)).map(function (x, y) {

  var template = {
    "_id" : 'ObjectId(' +chance.guid()+')',
    "name" : 'Group'+y,
  };

  //printjson(template);

  return template;
});



var leaders = Array.apply(0, Array(10)).map(function (x, y) {

  var name = chance.name();
  var login = name.split(" ")[1].toLowerCase();

  var template = {
    "_id" : 'ObjectId(' +chance.guid()+')',
    "login" : login,
    "fullname" : name,
    "leader" : null,
    "group" : groups[y]._id,
  };
  //printjson(template);
  return template;
});


var workers = Array.apply(0, Array(50)).map(function (x, y) {

  var leader = chance.pick(leaders);
  var group_id  = leader.group;
  var template = {
    "_id" : 'ObjectId(' +chance.guid()+')',
    "login" : chance.last(),
    "fullname" : chance.name(),
    "leader" : leader._id,
    "group" : group_id,
  };
  //printjson(template);

  return template;
});

var all_workers = workers.concat(leaders);



var date = moment();

//printjson(all_workers);



var probe_time_start = moment().startOf('day');


period.map(function (xx, yy) {

  var worker = chance.pick(workers);
  var leader_name =  all_workers.filter(function(x){return x._id === worker.leader})[0].fullname;

  var template =  {
    "_id" : 'ObjectId(' +chance.guid()+')',
    "worker_id" : worker._id,
    "duration" : 3600,
    "app_category" : "productive",

    "leader_name" : leader_name,

    "print_qty" : 3,
    "total_downloads_size" : 2145,
    "workstation" : chance.country({ full: true }).toUpperCase(),
    "effectiveness" : 100,
    "probe_time" : '------',

    "sample" : {
      "image_fs_name" : "app2.exe",
      "resource_image_name" : "",
      "window_caption" : "",
      "image_full_path" : ""
    },

    "user" : {
      "presence" : "active",
      "work_mode" : "work",
      "user_sid" : 'ObjectId(' +chance.guid()+')', // probably windows user sid
      "user_login" : worker.login
    },
  };

  var tmp = template;//JSON.parse(JSON.stringify(template));


  Array.apply(0, Array(moment.duration(xx.duration).asSeconds())).map(function (x, y) {
    var probe_time = probe_time_start.clone();
    probe_time.add(y, 'seconds');
    tmp.probe_time = probe_time.local().toISOString();
    tmp.duration = 1;

    tmp.user.work_mode = xx.work_mode;
    tmp.sample.image_fs_name = chance.pick(['gg','chrome','iexplorer','gra5','mediaplayer','app1'])+'.exe';


    //printjson(y+'   '+moment(tmp.probe_time).toLocaleString());
  });

  printjson(tmp);
});

