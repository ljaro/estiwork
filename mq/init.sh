#!/bin/sh

echo "***********************************"
echo "******** RabbitMQ init.sh *********"
echo "***********************************"

service rabbitmq-server start

#wait 2

#service rabbitmq-server status

rabbitmqctl add_user admin password
rabbitmqctl set_user_tags admin administrator
rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
rabbitmqctl delete_user guest
rabbitmqctl add_user user1 user1
rabbitmqctl set_permissions -p / user1 ".*" ".*" ".*"

service rabbitmq-server stop

#rabbitmq-server $@

#echo "********* start bash ***********"
/bin/sh -c $@



