/**
 * Created by luk on 2015-11-18.
 */

var module = {};

load("../assets/node_modules/numeral/numeral.js");
load("../assets/node_modules/chance/chance.js");
load("../assets/node_modules/moment/moment.js");



print('Script Mongo test start');


var sets = Array.apply(0, Array(3)).map(function(x,y){
  var period = [
    {duration: {h:2}, work_mode:'work' },
    {duration: {h:2}, work_mode:'work' }
  ];
  return period;
});




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


var events = [];

var probe_time_start = moment().startOf('day');

sets.map(function (xxx, yyy){

  print('Generate events for person '+yyy);


  xxx.map(function (xx, yy) {
    print('    period '+yy);

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

    var event_n = moment.duration(xx.duration).asSeconds();

    Array.apply(0, Array(event_n)).map(function (x, y) {

      tmp._id = 'ObjectId(' +chance.guid()+')';
      var probe_time = probe_time_start.clone();
      probe_time.add(y, 'seconds');
      tmp.probe_time = probe_time.local().toISOString();
      tmp.duration = 1;

      tmp.user.work_mode = xx.work_mode;
      tmp.sample.image_fs_name = chance.pick(['gg','chrome','iexplorer','gra5','mediaplayer','app1'])+'.exe';

      events.push(tmp);
    });

    print('        event 0..'+event_n);

  });

});

print('>>>> Rotate testdb1');

var dbname = 'testdb1';
var cleardb = true;

var conn = new Mongo();
var db = conn.getDB(dbname);

var dblist = db.adminCommand("listDatabases");

var db_count_max = 0;

for(var x in dblist.databases){
  //print(dblist.databases[x].name);

  var res = /(testdb)([0-9]+)/.exec(dblist.databases[x].name);

  if(res !== null){
    db_count_max = Math.max(db_count_max, res[2]);
  }
}

print('copying '+dbname+' to '+'testdb'+(Number(db_count_max)+1));
db.copyDatabase(dbname, 'testdb'+(Number(db_count_max)+1));

db = conn.getDB(dbname);

if(cleardb){
  db.getCollectionNames().forEach(function (name) {

    if( /system/.exec(name) === null)
    {
      if(db.getCollection(name).drop()){
        print('Dropped collection '+name);
      }else{
        print('Error droping collection '+name);
      }
    }
  })

}

print('>>>> Populating database');

db.groups.insert(groups);
db.workers.insert(all_workers);

print('Events to push '+events.length);

print('Result inserted '+db.events.insert(events).nInserted);

print('Events in collection '+db.events.count());
