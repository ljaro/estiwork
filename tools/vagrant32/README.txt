This version of vagrant file provides 32-bit virtual machines setup without db machine (no mongodb).
Should be used only when there is no hardware virtualization.




How to install mongodb.

!!Mongodb should be installed locally on your computer, not on VM guest!!

1. Download mongodb from https://www.mongodb.com/download-center?jmp=nav#community

2. Create folders where database will be stored and where config file will be placed

mkdir c:\mongodb\data\db
mkdir c:\mongodb\data\log

3. Create file mongod.cfg with content:

systemLog:
    destination: file
    path: c:\mongodb\data\log\mongod.log
storage:
    dbPath: c:\mongodb\data\db

and place it into c:\mongodb\

4. Run command console as administrator
go to mongodb installation folder. Default path is: C:\Program Files\MongoDB\Server\3.2\bin

run command 

`mongod.exe --config c:\mongodb\mongod.cfg --install`

and

net start MongoDB


also add folder C:\Program Files\MongoDB\Server\3.2\bin to PATH environment variables for better use of mondo.exe command


5. check if database is corretly installed and run

open cmd console and type `mongo` this should make connection without an error


6. If database is properly setup then last you should change IP for mondodb in :
/estiwork/web-ui/config/connections.js 

  someMongodbServer: {
	adapter: 'sails-mongo',
	host: '192.168.1.20', <--change to your host IP


you can check IP by going to guest machine `vagrant ssh web` and typing `netstat -rn` 

vagrant@web:/estiwork/web-ui$ netstat -rn
Kernel IP routing table
Destination     Gateway             Genmask         Flags   MSS Window  irtt Iface
0.0.0.0         10.0.2.2 <--this IP  0.0.0.0         UG        0 0          0 eth0
10.0.2.0        0.0.0.0            255.255.255.0   U         0 0          0 eth0
192.168.1.0     0.0.0.0            255.255.255.0   U         0 0          0 eth1


also you can install https://www.mongodb.com/download-center?jmp=nav#compass - MongoDB Compass allows you to quickly visualize the structure of data in your database, and perform ad hoc queries – all with zero knowledge of MongoDB's query language.



here is official instruction:
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#install-mongodb-community-edition
