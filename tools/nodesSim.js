var moment = require('moment');
var chance = require('chance').Chance(Math.random);

/***********************************************************
 ***********************************************************
 ***********************************************************
 */
const NUM_OF_WORKERS = 20;
const q = 'exchange_key1';
const MQHOST = 'amqp://user1:user1@mq'
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
    'opera apps guy': 2,
    'only active guy': 3,
    'only idle guy': 1,
    'more active guy': 2,
    'more idle guy': 1,
    'random guy': 1,
    'break lover guy': 1,
    'computer maniac guy':1,
    'computer hater guy':1,
    'good worker guy':1,
    'bad worker guy':1,
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


var samples_opera_apps = [
    {
        "window_caption": "Gazeta.pl - Opera",
        "image_fs_name": "opera.exe",
        "image_full_path": "C:\\Program Files (x86)\\Opera\\opera.exe",
        "resource_image_name": "opera.exe"
    },
    {
        "window_caption": "Onet.pl - Opera",
        "image_fs_name": "opera.exe",
        "image_full_path": "C:\\Program Files (x86)\\Opera\\opera.exe",
        "resource_image_name": "opera.exe"
    },
    {
        "window_caption": "Company of Heroes 2",
        "image_fs_name": "coh2.exe",
        "image_full_path": "\\Device\\HarddiskVolume2\\Windows\\System32\\coh2.exe",
        "resource_image_name": "coh2.exe"
    },
    {
        "window_caption": "xxxxx Prod. app on Opera - Opera",
        "image_fs_name": "opera.exe",
        "image_full_path": "C:\\Program Files (x86)\\Opera\\opera.exe",
        "resource_image_name": "opera.exe"
    }
];

var samples = [{
    "window_caption": "Gazeta.pl - Google Chrome",
    "image_fs_name": "chrome.exe",
    "image_full_path": "C:\\Program Files (x86)\\Google Chrome\\chrome.exe",
    "resource_image_name": "chrome.exe"
}, {
    "window_caption": "wp.pl - serwis informacyjny - Google Chrome",
    "image_fs_name": "chrome.exe",
    "image_full_path": "C:\\Program Files (x86)\\Google Chrome\\chrome.exe",
    "resource_image_name": "chrome.exe"
}, {
    "window_caption": "GG",
    "image_fs_name": "GG",
    "image_full_path": "C:\\Program Files (x86)\\GG\\gg.exe",
    "resource_image_name": ""
}, {
    "window_caption": "Company of Heroes 2",
    "image_fs_name": "coh2.exe",
    "image_full_path": "\\Device\\HarddiskVolume2\\Windows\\System32\\coh2.exe",
    "resource_image_name": "coh2.exe"
}, {
    "window_caption": "Mount and Blade 2",
    "image_fs_name": "mb2.exe",
    "image_full_path": "\\Device\\HarddiskVolume2\\Windows\\System32\\mb2.exe",
    "resource_image_name": "mb2.exe"
}, {
    "window_caption": "Total commander - shareware",
    "image_fs_name": "totalcmd.exe",
    "image_full_path": "\\Device\\HarddiskVolume2\\Windows\\System32\\totalcmd.exe",
    "resource_image_name": "totalcmd.exe"
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
        case 'good worker guy':
        case 'bad worker guy':
            result = chance.weighted(['ACTIVE', 'IDLE'], [6, 1]);
            break;
        case 'more idle guy':
            result = chance.weighted(['ACTIVE', 'IDLE'], [1, 6]);
            break;
        case 'random guy':
            result = chance.weighted(['ACTIVE', 'IDLE'], [1, 1]);
            break;
        case 'computer hater guy':
            result = chance.weighted(['ACTIVE', 'IDLE'], [1, 3]);
            break;
        default:
            result = chance.weighted(['ACTIVE', 'IDLE'], [3, 1]);
            break;
    }

    return result;
}
function calcStatus(user) {
    var usr_info = user.user_info;
    var result;
    switch (usr_info) {
        case 'opera apps guy':
        case 'only active guy':
            result = chance.weighted(['BREAK', 'WORK_WITH_COMPUTER', 'WORK_WITHOUT_COMPUTER'], [0.5, 6, 2]);
            break;
        case 'only idle guy':
            result = chance.weighted(['BREAK', 'WORK_WITH_COMPUTER', 'WORK_WITHOUT_COMPUTER'], [0.5, 6, 2]);
            break;
        case 'more active guy':
        case 'good worker guy':
        case 'bad worker guy':
            result = chance.weighted(['BREAK', 'WORK_WITH_COMPUTER', 'WORK_WITHOUT_COMPUTER', 'CUSTOM_1', 'CUSTOM_2', 'CUSTOM_3'], [1, 6, 2, 1, 1, 1]);
            break;
        case 'more idle guy':
            result = chance.weighted(['BREAK', 'WORK_WITH_COMPUTER', 'WORK_WITHOUT_COMPUTER', 'CUSTOM_1', 'CUSTOM_2', 'CUSTOM_3'], [1, 6, 2, 1, 1, 1]);
            break;
        case 'random guy':
            result = chance.weighted(['BREAK', 'WORK_WITH_COMPUTER', 'WORK_WITHOUT_COMPUTER', 'CUSTOM_1', 'CUSTOM_2', 'CUSTOM_3'], [1, 1, 1, 1, 1, 1]);
            break;
        case 'break lover guy':
            result = chance.weighted(['BREAK', 'WORK_WITH_COMPUTER', 'WORK_WITHOUT_COMPUTER', 'CUSTOM_1', 'CUSTOM_2', 'CUSTOM_3'], [6, 0, 0, 0, 0, 0]);
            break;
        case 'computer maniac guy':
            result = chance.weighted(['BREAK', 'WORK_WITH_COMPUTER', 'WORK_WITHOUT_COMPUTER', 'CUSTOM_1', 'CUSTOM_2', 'CUSTOM_3'], [0, 1, 0, 0, 0, 0]);
            break;
        case 'computer hater guy':
            result = chance.weighted(['BREAK', 'WORK_WITH_COMPUTER', 'WORK_WITHOUT_COMPUTER', 'CUSTOM_1', 'CUSTOM_2', 'CUSTOM_3'], [0, 0, 1, 0, 0, 0]);
            break;
        case 'status1 lover guy':
            result = chance.weighted(['BREAK', 'WORK_WITH_COMPUTER', 'WORK_WITHOUT_COMPUTER', 'CUSTOM_1', 'CUSTOM_2', 'CUSTOM_3'], [0.5, 3, 1, 6, 0, 0]);
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
        "machine": {"machine_sid": 'MACHINE_'+user.user_sid},
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

function getSampleForGuy(user_info){
    switch(user_info){
        case 'opera apps guy':
            return chance.weighted(samples_opera_apps, [1,1,1,5]);
            break;
        case 'good worker guy':
            return samples[0];
            break;
        default:
            return chance.pickone(samples);
            break;
    }
}

function sendTPL(ch, probe_time, duration, user) {
    var testTimeNow = moment();
    var diff = testTimeNow.diff(probe_time);

    schedule(ch, randomIntInc(5, 35), user);

    ch.sendToQueue(q, new Buffer(fillTPL(probe_time, duration, getSampleForGuy(user.user_info), user)));

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
    .connect(MQHOST, function (err, conn) {
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
