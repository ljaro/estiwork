/**
 * Created by luk on 2016-02-22.
 */


var amq = require('amqplib');


//TODO mamory leak unit test needed

var RabbitConsumerService = {

    createConnection: function (perSrv) {

        var q = 'tasks';
        var amq = require('amqplib');
        var RECONNECT_T = 300;
        var RETRY_TIMES = 5;
        var recoveryCount = 0;

        var __connect = function () {
            var open = amq.connect('amqp://localhost');
            open.then(function (conn) {
                conn.on('error', function (err) {
                    console.log('conn ' + err);
                    setTimeout(function () {
                        recoveryCount++;
                        if (recoveryCount < RETRY_TIMES) {
                            console.log('reconnecting rabbit');
                            __channel(conn);
                        }else{
                            console.log('too many errors');
                            process.exit(1);
                        }
                    }, RECONNECT_T);
                });
                __channel(conn);
            }, function (err) {
                setTimeout(function () {
                    __connect();
                }, RECONNECT_T);
            });
        }

        var consume = function (channel) {
            channel.assertQueue(q);
            channel.consume(q, function (msg) {
                if (msg !== null) {
                    channel.ack(msg); //TODO simple ack, no exception safety
                    perSrv.accept(msg);
                }
            });
        }

        var __channel = function (conn) {
            var ok = conn.createChannel();
            ok.then(function (ch) {
                consume(ch);
            }, function (err) {
                console.log('still error');
                setTimeout(function () {
                    recoveryCount++;
                    if (recoveryCount < RETRY_TIMES) {
                        __connect();
                    } else {
                        console.log('too many errors');
                        process.exit(1);
                    }
                }, RECONNECT_T);
            });
        }

        __connect();

    }

};


module.exports = RabbitConsumerService;
