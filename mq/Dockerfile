FROM rabbitmq:3.6.5-management

ADD init.sh /init.sh
RUN chmod 777 /init.sh

EXPOSE 15672 5672


CMD ["/init.sh", "rabbitmq-server"]




