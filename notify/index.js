var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/uploads';    

const results = [];
pg.connect(connectionString, (err, client, done) => {
  if(err) {
    console.log(err);
  }
  client.on('notification', function(msg) {
    console.log(msg);
  });
  var query = client.query("LISTEN watchers");
});

