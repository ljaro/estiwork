FROM node:4.5.0


RUN apt-get update
RUN apt-get install -y curl

RUN npm -g install bower
RUN npm -g install sails
RUN npm -g install moment
RUN npm -g install chance
RUN npm -g install amqplib
RUN npm -g install nodemon


ADD package.json /tmp/estiwork/web-ui/package.json
RUN cd /tmp/estiwork/web-ui && npm install
RUN mkdir -p /estiwork/web-ui && cp -a /tmp/estiwork/web-ui/node_modules /estiwork/web-ui/


ADD ./assets/package.json /tmp/estiwork/web-ui/assets/package.json
ADD ./assets/bower.json /tmp/estiwork/web-ui/assets/bower.json
RUN cd /tmp/estiwork/web-ui/assets && npm install && bower install --allow-root
RUN mkdir -p /estiwork/web-ui/assets && cp -a /tmp/estiwork/web-ui/assets/node_modules /estiwork/web-ui/assets && cp -a /tmp/estiwork/web-ui/assets/bower_components /estiwork/web-ui/assets

WORKDIR /estiwork/web-ui
ADD . /estiwork/web-ui

EXPOSE 1337



CMD ["nodemon", "./boot.js"]


