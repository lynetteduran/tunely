// SERVER-SIDE JAVASCRIPT

//requires dependencies in our app
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// generates a new express app and calls it 'app'
var app = express();

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));

/************
 * DATABASE *
 ************/

 var db = require('./models');

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

/*
 * JSON API Endpoints
 */

app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to tunely!",
    documentation_url: "https://github.com/tgaff/tunely/api.md",
    base_url: "http://tunely.herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});

app.get('/api/albums', function albums_index(req, res){
  db.Album.find({}, function(err, albums) {
    res.json(albums);
  });
});

app.post('/api/albums', function albumCreate(req, res){
  console.log('body', req.body);

  // splits genres [] indeces, cuts out whitespaces, updates array
  var genres = req.body.genres.split(',').map(function(item) {
    return item.trim();
  });
  req.body.genres = genres;

  //creates album instance in db with POST body key-value pairs
  db.Album.create(req.body, function(err, album) {
    if (err) {
      console.log('error', err);
    }
    console.log(album);
    res.json(album);
  });
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
