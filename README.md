# estiwork
Monitoring software and web UI


###Manual installation

App consists of such components: 
- nodejs v4.5.0
- mongodb:3.2.6
- rabbitmq:3.6.5
- npm 2.15.9

1. install above components
2. all of them should be in PATH env variable, so you can run directly run them from command line console
   
  open console (with administrator rights on windows) and run each command to check if exists 
   - `node` <enter>
   - `mongo` <enter>
   - `rabbitmqctl` <enter>
   - `npm -v` <enter>
   
3. You need remove guest user from RabbitMq and add new one
   - `rabbitmqctl add_user admin password`
   - `rabbitmqctl set_user_tags admin administrator`
   - `rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"`
   - `rabbitmqctl delete_user guest`
   - `rabbitmqctl add_user user1 user1`
   - `rabbitmqctl set_permissions -p / user1 ".*" ".*" ".*"`
   - `rabbitmq-plugins enable rabbitmq_management`
   
   go to admin page [http://localhost:15672/#/]()

4. MongoDB installed only copy files. To install service follow [https://github.com/zer0m/estiwork/blob/master/tools/vagrant32/README.txt]()

5. add hosts to `/etc/hosts` or `C:\Windows\System32\drivers\etc\hosts`
    
   put two lines in hosts file
    ```
    127.0.0.1   mq
    127.0.0.1   db
    ```
6. clone this repo
7. go to `web-ui` and run `npm install`
8. go to `web-ui\assets` and run `npm install`


###Docker installation

1. install docker for linux https://docs.docker.com/engine/installation/linux/ubuntulinux/
2. create docker group https://docs.docker.com/engine/installation/linux/ubuntulinux/#/create-a-docker-group
3. install docker-compose https://docs.docker.com/compose/install/
4. clone this repo
5. go to `estiwork` cloned repo dir
6. run `docker-compose up`



###Vagrant installation

1. install VirtualBox
2. install Vagrant
3. clone this repo
4. run command prompt as administrator
5. go to cloned repo `estiwork/tools/vagrant`
6. run `vagrant up`

###If any troubles:

1. type `ssh` in cmd line to check if exits in PATH env variable
2. in Vagrantfile uncomment gui = true
3. type `vagrant ssh-config` and delete insecure ssh key file
4. in Vagrantfile uncomment `#vb.customize ["modifyvm", :id, "--nictype1", "Am79C973"]`
5. try disable windows firewall



**In order to ssh into vagrant vm, you need to have ssh client in PATH, i.e from git installation `C:\Program Files\Git\usr\bin`**

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




test1