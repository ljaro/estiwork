# estiwork
Monitoring software and web UI

1. install VirtualBox
2. install Vagrant
3. run command prompt as administrator
4. goto `estiwork/tools/vagrant`
5. run `vagrant up`

1. run `vagrant ssh web` (you are in `web` virtual machine box)
2. on `web` box run cmd `cd /estiwork/web-ui` and `install npm`
3. on `web` box run cmd `cd /estiwork/web-ui/assets` and `install npm`
4. on `web` box run cmd `cd /estiwork/web-ui` and `sails lift`

