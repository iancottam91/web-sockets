var express = require('express');
var path = require('path');
var fs = require('fs');
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/uploads';

var app = new express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// app.use('/js', express.static(path.resolve(__dirname, 'assets', 'js')));
// app.use('/img', express.static(path.resolve(__dirname, 'assets', 'img')));
app.use(express.static('assets'))

// *** DB WORK *** //

// watch
pg.connect(connectionString, (err, client, done) => {
  if(err) {
    console.log(err);
  }
  client.on('notification', function(msg) {
    console.log('DB UPDATE:');
    console.log(msg);
    io.emit('db update', msg);
  });
  var query = client.query("LISTEN watch_item_upload");
});


// Standard GET
app.get('/api/uploads', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items ORDER BY id ASC;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

// READ
// *** DB WORK END *** //


// ROUTE THE REST OF THE URLS TO INDEX.HTML
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// set up web sockets
io.on('connection', function(socket){
  console.log('a user connected');
  // listen for events emitted from client
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    // emit an event to all clients
    io.emit('chat message', msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


// START SERVER
var port = process.env.PORT || 7002;
http.listen(port, 'localhost', function() {
  console.log('Express server listesning on port ' + port);
});