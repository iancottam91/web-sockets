var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/uploads';

var app = new express();
app.use(bodyParser.json());
app.use(express.static('assets'));

// *** DB WORK *** //

// CREATE
app.post('/api/upload', (req, res, next) => {

  console.log(req.body);

  const results = [];
  // Grab data from http request
  const data = {text: req.body.text, complete: false};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO items(name) values($1)',
    [data.text]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items ORDER BY id ASC');
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
// *** DB WORK END *** //


// STATIC ASSETS
app.use('/dist', express.static(path.resolve(__dirname, 'dist')));

// CLIENT UI - ROUTE THE REST OF THE URLS TO INDEX.HTML
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// START SERVER
var port = process.env.PORT || 7001;
app.listen(port, 'localhost', function() {
  console.log('Express server listening on port ' + port);
});