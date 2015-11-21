/**
 * Created by luk on 2015-11-18.
 */

var module = {};

load("../assets/node_modules/numeral/numeral.js");
load("../assets/node_modules/chance/chance.js");
load("../assets/node_modules/moment/moment.js");
load("../assets/node_modules/moment/locale/pl.js");
load("./gendata1.js");

function deepCopy(oldObj) {
  var newObj = oldObj;
  if (oldObj && typeof oldObj === 'object') {
    newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
    for (var i in oldObj) {
      newObj[i] = deepCopy(oldObj[i]);
    }
  }
  return newObj;
}

print('Script Mongo test start');


var groups = Array.apply(0, Array(10)).map(function (x, y) {

  var template = {
    "_id" : ObjectId(),
    "name" : 'Group'+y,
  };
  return template;
});



var leaders = Array.apply(0, Array(10)).map(function (x, y) {

  var name = chance.name();
  var login = name.split(" ")[1].toLowerCase();

  var template = {
    "_id" : ObjectId(),
    "login" : login,
    "fullname" : name,
    "leader" : null,
    "group" : groups[y]._id,
  };
  return template;
});


var workers = Array.apply(0, Array(50)).map(function (x, y) {

  var leader = chance.pick(leaders);
  var group_id  = leader.group;
  var template = {
    "_id" : ObjectId(),
    "login" : chance.last(),
    "fullname" : chance.name(),
    "leader" : leader._id,
    "group" : group_id,
  };
  return template;
});

var all_workers = workers.concat(leaders);



var date = moment();

//printjson(all_workers);


var events = [];

print('Moment locale '+moment.locale())

persons.map(function (person, person_idx){

  print('Generate events for person '+person_idx);

  var worker = chance.pick(workers);
  var worker_id = worker._id.str;
  var leader_name =  all_workers.filter(function(x){return x._id === worker.leader})[0].fullname;


  var template =  {
    "_id" : ObjectId(),
    "worker_id" : ObjectId(worker_id),
    "duration" : 3600,
    "app_category" : "productive",
    "leader_name" : leader_name,
    "print_qty" : 3,
    "total_downloads_size" : 2145,
    "workstation" : chance.word({ syllabes: 3 }).toUpperCase(),
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
      "user_sid" : chance.guid(), // probably windows user sid
      "user_login" : worker.login
    },
  };

  person.map(function (day, dayidx) {

    print('    day '+moment(day.day).format('YYYY-MM-DD'));

    day.schedule.map(function (schedule, scheduleidx) {

      print('        schedule '+scheduleidx);


      var event_n = moment.duration(schedule.duration).asSeconds();
      var event_idx = 0;

      Array.apply(0, Array(event_n)).map(function (x, y) {

        var tmp = deepCopy(template);
        tmp._id = ObjectId();//TODO deepCopyy fuckup above ObjectId
        tmp.worker_id = ObjectId(worker_id);

        var probe_time = moment(day.day);
        probe_time.add(event_idx++, 'seconds');
        tmp.probe_time = probe_time.local().toISOString();
        tmp.duration = 1;

        tmp.user.work_mode = schedule.work_mode;
        tmp.sample.image_fs_name = chance.pick(['gg','chrome','iexplorer','gra5','mediaplayer','app1'])+'.exe';

        events.push(tmp);
      });

      print('            event 0..'+event_n);

    });
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
    if(res[2] > 5){
      var db1 = conn.getDB(dblist.databases[x].name);
      if(db1.dropDatabase()){
        print('Old db dropped');
      }else{
        print('Error dropping old db');
      }
    }
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

function populate() {
  print('>>>> Populating database');

  db.groups.insert(groups);
  db.workers.insert(all_workers);

  print('Events to push '+events.length);
  var inserted = db.events.insert(events).nInserted;
  print('Result inserted '+inserted);

  print('Events in collection '+db.events.count());

  if(events.length !== inserted && inserted !== db.events.count()){
    print('Error inserting events');
  }
}


populate();
