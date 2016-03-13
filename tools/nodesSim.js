var moment = require('moment');
var chance = require('chance').Chance(1234);

/***********************************************************
 ***********************************************************
 ***********************************************************
 */
const NUM_OF_WORKERS = 5;
const q = 'exchange_key1';

/***********************************************************
 ***********************************************************
 */



Object.values = function (obj) {
    var vals = Object.keys(obj).map(function (key) {
        return obj[key];
    });
    return vals;
}

var channels = [];

var user_info_weights = {
    'only active guy': 3,
    'only idle guy': 1,
    'more active guy': 2,
    'more idle guy': 1,
    'random guy': 1,
};


chance.mixin({
    'user': function () {
        return {
            user_login: chance.first(),
            user_sid: chance.guid(),
            user_info: chance.weighted(Object.keys(user_info_weights), Object.values(user_info_weights))
        };
    }
});


var users = Object.keys(user_info_weights).map(function (user_info) {
    return {
        'user_login': chance.first(),
        'user_sid': chance.guid(),
        'user_info': user_info
    }
}).concat(chance.unique(chance.user, NUM_OF_WORKERS));

//console.log("Worker num: " + users.length + " (" + NUM_OF_WORKERS + ")");

var samples = [{
    "window_caption": "Chrome - Gazeta.pl",
    "image_fs_name": "Chrome",
    "image_full_path": "\\Device\\HarddiskVolume2\\Windows\\System32\\cmd.exe",
    "resource_image_name": ""
}, {
    "window_caption": "Chrome - wp.pl - serwis informacyjny",
    "image_fs_name": "Chrome",
    "image_full_path": "\\Device\\HarddiskVolume2\\Windows\\System32\\cmd.exe",
    "resource_image_name": ""
}, {
    "window_caption": "GG",
    "image_fs_name": "GG",
    "image_full_path": "\\Device\\HarddiskVolume2\\Windows\\System32\\cmd.exe",
    "resource_image_name": ""
}, {
    "window_caption": "Company of Heroes 2",
    "image_fs_name": "coh2",
    "image_full_path": "\\Device\\HarddiskVolume2\\Windows\\System32\\cmd.exe",
    "resource_image_name": ""
}, {
    "window_caption": "Mount and Blade 2",
    "image_fs_name": "mb2",
    "image_full_path": "\\Device\\HarddiskVolume2\\Windows\\System32\\cmd.exe",
    "resource_image_name": ""
}, {
    "window_caption": "Total commander - shareware",
    "image_fs_name": "totalcmd",
    "image_full_path": "\\Device\\HarddiskVolume2\\Windows\\System32\\cmd.exe",
    "resource_image_name": ""
}];

function calcPresence(user) {
    var usr_info = user.user_info;
    var result;
    switch (usr_info) {
        case 'only active guy':
            result = 'ACTIVE';
            break;
        case 'only idle guy':
            result = 'IDLE';
            break;
        case 'more active guy':
            result = chance.weighted(['ACTIVE', 'IDLE'], [6, 1]);
            break;
        case 'more idle guy':
            result = chance.weighted(['ACTIVE', 'IDLE'], [1, 6]);
            break;
        case 'random guy':
            result = chance.weighted(['ACTIVE', 'IDLE'], [1, 1]);
            break;
        default:
            process.exit();
            break;
    }

    return result;
}
function calcStatus(user) {
    var usr_info = user.user_info;
    var result;
    switch (usr_info) {
        case 'only active guy':
            result = chance.weighted(['BREAK', 'WORK_WITH_COMPUTER', 'WORK_WITHOUT_COMPUTER'], [0.5, 6, 2]);
            break;
        case 'only idle guy':
            result = chance.weighted(['BREAK', 'WORK_WITH_COMPUTER', 'WORK_WITHOUT_COMPUTER'], [0.5, 6, 2]);
            break;
        case 'more active guy':
            result = chance.weighted(['BREAK', 'WORK_WITH_COMPUTER', 'WORK_WITHOUT_COMPUTER', 'CUSTOM_1', 'CUSTOM_2', 'CUSTOM_3'], [1, 6, 2, 1, 1, 1]);
            break;
        case 'more idle guy':
            result = chance.weighted(['BREAK', 'WORK_WITH_COMPUTER', 'WORK_WITHOUT_COMPUTER', 'CUSTOM_1', 'CUSTOM_2', 'CUSTOM_3'], [1, 6, 2, 1, 1, 1]);
            break;
        case 'random guy':
            result = chance.weighted(['BREAK', 'WORK_WITH_COMPUTER', 'WORK_WITHOUT_COMPUTER', 'CUSTOM_1', 'CUSTOM_2', 'CUSTOM_3'], [1, 1, 1, 1, 1, 1]);
            break;
        default:
            process.exit();
            break;
    }

    return result;
}
function fillTPL(probe_time, duration, sample, user) {

    user['presence'] = calcPresence(user);
    user['work_mode'] = calcStatus(user);

    var TPL = {
        "probe_time": probe_time.toISOString(),
        "duration": duration,
        "user": user,
        "machine": {"machine_sid": ""},
        "sample": sample
    };
    return JSON.stringify(TPL);
}

function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}


function logMsg(user, probe_time, duration, testTimeNow, diff) {
    console.log(user.user_login + "> " + probe_time.toISOString() + ", " + duration + " (" + testTimeNow.toISOString() + ")" + "    diff:" + diff + "=" + duration);
}

function sendTPL(ch, probe_time, duration, user) {
    var testTimeNow = moment();
    var diff = testTimeNow.diff(probe_time);

    schedule(ch, randomIntInc(5, 35), user);

    ch.sendToQueue(q, new Buffer(fillTPL(probe_time, duration, chance.pickone(samples), user)));

    logMsg(user, probe_time, duration, testTimeNow, diff);
}

/*
 schedule with OLD_DATA + DURATION    data------------duration
 */
function schedule(ch, duration, user) {
    var probe_time = moment();
    setTimeout(function () {
        sendTPL(ch, probe_time, duration, user);
    }, duration * 1000);
}

function startSending(ch, user) {
    schedule(ch, 1, user);
}

function bail(err) {
    console.error(err);
    process.exit(1);
}

// Publisher
function publisher(conn) {
    conn.createChannel(on_open);
    function on_open(err, ch) {
        if (err != null) bail(err);
        channels.push(ch);

        users.forEach(function (usr) {
            startSending(ch, usr);
        });
    }
}

require('amqplib/callback_api')
    .connect('amqp://localhost', function (err, conn) {
        if (err != null) bail(err);
        publisher(conn);
    });

function exitHandler(options, err) {
    if (options.cleanup) {
        channels.forEach(function (ch) {
            ch.close();
            console.log('closing channel');
        });
        console.log('clean');
    }
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

process.on('exit', exitHandler.bind(null, {cleanup: true}));

