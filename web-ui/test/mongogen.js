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

print('Script Mongo test started at');

var script_start_time = moment();

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



print('>>>> Rotate testdb1');

var dbname = 'testdb1';
var cleardb = true;

var conn = new Mongo();
var db = conn.getDB(dbname);

var dblist = db.adminCommand("listDatabases");

var db_count_max = 0;

for (var x in dblist.databases) {
  //print(dblist.databases[x].name);

  var res = /(testdb)([0-9]+)/.exec(dblist.databases[x].name);

  if (res !== null) {
    db_count_max = Math.max(db_count_max, res[2]);
    if (res[2] > 5) {
      var db1 = conn.getDB(dblist.databases[x].name);
      if (db1.dropDatabase()) {
        print('Old db dropped');
      } else {
        print('Error dropping old db');
      }
    }
  }


}

print('copying ' + dbname + ' to ' + 'testdb' + (Number(db_count_max) + 1));
db.copyDatabase(dbname, 'testdb' + (Number(db_count_max) + 1));

db = conn.getDB(dbname);

if (cleardb) {
  db.getCollectionNames().forEach(function (name) {

    if (/system/.exec(name) === null) {
      if (db.getCollection(name).drop()) {
        print('Dropped collection ' + name);
      } else {
        print('Error droping collection ' + name);
      }
    }
  })

}


db.getCollection('group').insert(groups);
db.worker.insert(all_workers);

var eventCollection = db.getCollection('event');
//var inserted = eventCollection.insert(events).nInserted;



var date = moment();

print('Moment locale '+moment.locale())

var workersList = workers.slice(0);

persons.map(function (person, person_idx){

  print('Generate events for person '+person_idx);

  var worker = chance.pick(workersList);

  if(worker !== null){
    var index = workersList.indexOf(worker);
    if (index > -1) {
      workersList.splice(index, 1);
    }
  }else
  {
    print('ERROR duplicate worker choosen');
    return;
  }

  var worker_id = worker._id.str;
  var leader_name =  all_workers.filter(function(x){return x._id === worker.leader})[0].fullname;


  var template =  {
    "_id" : ObjectId(),
    "worker_id" : 0,
    "duration" : 3600,
    "app_category" : "productive",

    "workstation" : chance.word({ syllabes: 3 }).toUpperCase(),

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

      var events = [];
      var event_n = moment.duration(schedule.duration).asSeconds();
      var event_idx = 0;

      Array.apply(0, Array(event_n)).map(function (x, y) {

        var tmp = deepCopy(template);
        tmp._id = ObjectId();//TODO deepCopyy fuckup above ObjectId

        tmp.worker_id = ObjectId(worker_id);

        var probe_time = moment(day.day);
        probe_time.add(event_idx++, 'seconds');
        tmp.probe_time = new Date(probe_time.local().toISOString());
        tmp.duration = 1;

        tmp.user.work_mode = schedule.work_mode;
        tmp.user.presence = schedule.presence;
        tmp.app_category = schedule.app_category;

        tmp.sample.image_fs_name = chance.pick(['gg','chrome','iexplorer','gra5','mediaplayer','app1'])+'.exe';

        events.push(tmp);
      });

      print('            event 0..'+event_n);
      print('            event inserted '+eventCollection.insert(events).nInserted);
    });
  });


});




print('Events in collection '+db.event.count());

var script_end_time = moment();

var script_time_diff = script_end_time.diff(script_start_time, 'seconds');

print('Elapsed '+moment.duration(script_time_diff, 'seconds')+'s');
