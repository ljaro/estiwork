# estiwork
Monitoring software and web UI

1. install VirtualBox
2. install Vagrant
3. run command prompt as administrator
4. goto `estiwork/tools/vagrant`
5. run `vagrant up`

####

1. run `vagrant ssh web` (you are in `web` virtual machine box)
2. on `web` box run cmd `cd /estiwork/web-ui/assets` and run `npm install`
3. on `web` box run cmd `cd /estiwork/web-ui` and run `sails lift`

#### DEBUG

1. run sails with `sails debug`
2. goto `http://127.0.0.1:8080/?port=5858` on Chrome Browser

See http://sailsjs.org/documentation/reference/command-line-interface/sails-debug
