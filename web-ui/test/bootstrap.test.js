var Sails = require('sails');
var sails;

before(function(done) {
  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(5000);

  $NODE_ENV = "testing";
  Sails.load({
  // configuration for testing purposes
    models: {
      connection: 'testing',
      migrate: 'drop'
    },

    connections: {
      testing: {
        adapter: 'sails-disk'
      }
    }
  }, function(err, server) {

    sails = server;
    if (err) return done(err);
    // here you can load fixtures, etc.
    done(err, sails);
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  Sails.lower(done);
});
