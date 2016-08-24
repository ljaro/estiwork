/**
 *  This file is used for creating a symlink between the actual ./node_modules folder
 *  and the ./src/node_modules "folder".
 *
 *  This is due to being able to both run the app smoothly in a local and containerized environment.
 */

var fs = require('fs');

// Paths
var NODE_MODULES = '/tmp/estiwork/web-ui/node_modules'
var SRC_NODE_MODULES = './node_modules';


var AS_NODE_MODULES = '/tmp/estiwork/web-ui/assets/node_modules'
var AS_SRC_NODE_MODULES = './assets/node_modules';


var BOWER_MODULES = '/tmp/estiwork/web-ui/assets/bower_components'
var SRC_BOWER_MODULES = './assets/bower_components';



// Check if the symlink is already existing..
fs.exists(SRC_NODE_MODULES, function(exists) {

  // ?: Is it NOT existing?
  if (!exists) {
    // -> Nope, then create it and launch the server
    createSymLink(dummy);
    return;
  }
  // E -> The symlink exists!
  console.log('! SYMLINK exists, recreate it..')
  // Remove the existing link (why? Because we do not know if it was created locally or in a container)
  fs.unlink(SRC_NODE_MODULES, function(err) {

    if (err) return console.log(err);

    // Double check that the link was removed
    fs.exists(SRC_NODE_MODULES, function(exists) {

      console.log('! SYMLINK was ' + (exists ? 'NOT DELETED!' : 'deleted successfully..'));

      // Was it removed?
      if (exists) {
        // -> NO! Then abort mission!
        return console.log('! Aborting server launch..')
      }
      // E -> It was removed successfully. Re-create it and launch the server
      createSymLink(dummy);
    });
  });
});

var secondCheck = function () {
// Check if the symlink is already existing..
fs.exists(AS_SRC_NODE_MODULES, function(exists) {

  // ?: Is it NOT existing?
  if (!exists) {
    // -> Nope, then create it and launch the server
   ascreateSymLink(dummy2);
    return;
  }
  // E -> The symlink exists!
  console.log('! SYMLINK exists, recreate it..')
  // Remove the existing link (why? Because we do not know if it was created locally or in a container)
  fs.unlink(AS_SRC_NODE_MODULES, function(err) {

    if (err) return console.log(err);

    // Double check that the link was removed
    fs.exists(AS_SRC_NODE_MODULES, function(exists) {

      console.log('! SYMLINK was ' + (exists ? 'NOT DELETED!' : 'deleted successfully..'));

      // Was it removed?
      if (exists) {
        // -> NO! Then abort mission!
        return console.log('! Aborting server launch..')
      }
      // E -> It was removed successfully. Re-create it and launch the server
      ascreateSymLink(dummy2);
    });
  });
});
}

var thirdCheck = function () {
// Check if the symlink is already existing..
fs.exists(SRC_BOWER_MODULES, function(exists) {

  // ?: Is it NOT existing?
  if (!exists) {
    // -> Nope, then create it and launch the server
    bwcreateSymLink(launchServer);
    return;
  }
  // E -> The symlink exists!
  console.log('! SYMLINK exists, recreate it..')
  // Remove the existing link (why? Because we do not know if it was created locally or in a container)
  fs.unlink(SRC_BOWER_MODULES, function(err) {

    if (err) return console.log(err);

    // Double check that the link was removed
    fs.exists(SRC_BOWER_MODULES, function(exists) {

      console.log('! SYMLINK was ' + (exists ? 'NOT DELETED!' : 'deleted successfully..'));

      // Was it removed?
      if (exists) {
        // -> NO! Then abort mission!
        return console.log('! Aborting server launch..')
      }
      // E -> It was removed successfully. Re-create it and launch the server
      bwcreateSymLink(launchServer);
    });
  });
});
}

var createSymLink = function(callback) {

  fs.symlink(NODE_MODULES, SRC_NODE_MODULES, 'dir', function(err) {

    if (err) return console.log(err);

    console.log('! SYMLINK created!')

    callback();
  });

}



var ascreateSymLink = function(callback) {

  fs.symlink(AS_NODE_MODULES, AS_SRC_NODE_MODULES, 'dir', function(err) {

    if (err) return console.log(err);

    console.log('! SYMLINK created!')

    callback();
  });

}

var bwcreateSymLink = function(callback) {

  fs.symlink(BOWER_MODULES, SRC_BOWER_MODULES, 'dir', function(err) {

    if (err) return console.log(err);

    console.log('! SYMLINK created!')

    callback();
  });

}

var launchServer = function() {
    console.log('! Launching server..')
    require('./app.js');
}

var  dummy = function() {

	secondCheck();

}

var dummy2 = function() {
	thirdCheck();
}



