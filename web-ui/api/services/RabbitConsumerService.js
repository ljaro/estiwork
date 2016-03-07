/**
 * Created by luk on 2016-02-22.
 */


var amq = require('amqplib');


//TODO mamory leak unit test needed

var RabbitConsumerService = {

  createConnection: function (perSrv) {

    var q = 'exchange_key1';
    var amq = require('amqplib');
    var RECONNECT_T = 300;
    var RETRY_TIMES = 5;
    var recoveryCount = 0;
    var uack = 0;
    var UACKE_TIMES = 50;

    var newestConnection = null;

    var __connect = function () {
      var open = amq.connect('amqp://localhost');
      open.then(function (conn) {
        newestConnection = conn;
        conn.on('error', function (err) {
          console.log('conn ' + err);
          setTimeout(function () {
            recoveryCount++;
            if (recoveryCount < RETRY_TIMES) {
              console.log('reconnecting rabbit');
              __channel(conn);
            } else {
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
          perSrv.accept(msg).then(function () {
            channel.ack(msg);
            //console.log("msg rec");
          }, function (err) {
            //TODO handle error
            //TODO refactor flow of resuming etc.
            console.log('error after accept' + err);
            if (uack++ > UACKE_TIMES) {
              channel.close();
              __channel(newestConnection);
              uack = 0;
            }
          });
        }
      });
    }

    var __channel = function (conn) {
      var ok = conn.createChannel();
      ok.then(function (ch) {
        //console.log('Channel opened');
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
