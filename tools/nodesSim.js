var q = 'exchange_key1';
var moment = require('moment');


var channels = [];

var samples = [{
    "window_caption": "Chrome - Gazeta.pl",
    "image_fs_name": "c:\\Program Files (x86)\\Google\\Chrome\\chrome.exe",
    "image_full_path": "\\Device\\HarddiskVolume2\\Windows\\System32\\cmd.exe",
    "resource_image_name": ""
}, {
    "window_caption": "Chrome - wp.pl - serwis informacyjny",
    "image_fs_name": "c:\\Program Files (x86)\\Google\\Chrome\\chrome.exe",
    "image_full_path": "\\Device\\HarddiskVolume2\\Windows\\System32\\cmd.exe",
    "resource_image_name": ""
}];

function fillTPL(probe_time, duration, sample) {
    var TPL = {
        "probe_time": probe_time.toISOString(),
        "duration": duration,
        "user": {
            "user_sid": "S-1-5-21-2242820312-3698568055-2602798999-1000",
            "user_login": "luk",
            "presence": "IDLE",
            "work_mode": "WORK_WITH_COMPUTER"
        },
        "machine": {"machine_sid": ""},
        "sample": sample
    };
    return JSON.stringify(TPL);
}

function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}


function sendTPL(ch, probe_time, duration) {
    var testTimeNow = moment();
    var diff = testTimeNow.diff(probe_time);

    schedule(ch, randomIntInc(5*1000, 35*1000));

    var msg = fillTPL(probe_time, duration, samples[randomIntInc(0, 1)]);
    ch.sendToQueue(q, new Buffer(msg));

    console.log(">" + probe_time.toISOString() + ", " + duration + " (" + testTimeNow.toISOString() + ")" + "    diff:" + diff + "=" + duration);
}

/*
 schedule with OLD_DATA + DURATION    data------------duration
 */
function schedule(ch, duration) {
    var probe_time = moment();
    setTimeout(function () {
        sendTPL(ch, probe_time, duration);
    }, duration);
}

function startSending(ch) {
    schedule(ch, 1000);
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
        startSending(ch);

        //ch.assertQueue(q, function (err, ok) {
        //    console.log('Channel');
        //    if (err != null) bail(err);
        //    channels.push(ch);
        //    startSending(ch);
        //});
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