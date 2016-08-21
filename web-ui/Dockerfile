FROM node:4.5.0


ADD . /estiwork/web-ui

RUN apt-get update
RUN apt-get install -y curl

RUN npm -g install bower
RUN npm -g install sails
RUN npm -g install moment
RUN npm -g install chance
RUN npm -g install amqplib

WORKDIR /estiwork/web-ui
RUN npm install

WORKDIR /estiwork/web-ui/assets
RUN npm install
RUN bower install --allow-root

WORKDIR /estiwork/web-ui


EXPOSE 1337



CMD sails lift

