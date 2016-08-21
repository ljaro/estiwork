# estiwork
Monitoring software and web UI

Docker installation

1. install docker for linux https://docs.docker.com/engine/installation/linux/ubuntulinux/
2. create docker group https://docs.docker.com/engine/installation/linux/ubuntulinux/#/create-a-docker-group
3. install docker-compose https://docs.docker.com/compose/install/
4. clone this repo
5. go to `estiwork` cloned repo dir
6. run `docker-compose up`




Vagrant installation

1. install VirtualBox
2. install Vagrant
3. clone this repo
4. run command prompt as administrator
5. go to cloned repo `estiwork/tools/vagrant`
6. run `vagrant up`

If any troubles:

1. type `ssh` in cmd line to check if exits in PATH env variable
2. in Vagrantfile uncomment gui = true
3. type `vagrant ssh-config` and delete insecure ssh key file
4. in Vagrantfile uncomment `#vb.customize ["modifyvm", :id, "--nictype1", "Am79C973"]`
5. try disable windows firewall

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
