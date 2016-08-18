# estiwork
Monitoring software and web UI

1. install VirtualBox
2. install Vagrant
3. run command prompt as administrator
4. goto `estiwork/tools/vagrant`
5. run `vagrant up`

####

Be sure to have ssh client in PATH, i.e from `C:\Program Files\Git\usr\bin`

1. run `vagrant ssh web` (you are in `web` virtual machine box)
2. on `web` box run cmd `cd /estiwork/web-ui/assets` and run `npm install`
3. on `web` box run cmd `cd /estiwork/web-ui` and run `sails lift`
4. now if you go to `http://localhost:1337` you should see app
5. also you can check rabbitmq installed `localhost:15672/#/`

at the end go to `web` vm by `vagrant ssh web`
go to `/estiwork/tools`
run `node nodeSim.js`
you should see data on web application -> `http://localhost:1337`

#### DEBUG

1. run sails with `sails debug`
2. goto `http://127.0.0.1:8080/?port=5858` on Chrome Browser

See http://sailsjs.org/documentation/reference/command-line-interface/sails-debug
