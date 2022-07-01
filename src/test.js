// Express server on port 3000
var express = require('express');
var app = express();
var port = 3000;

// Return the current time
app.get('/', function (req, res) {
  res.send('Hello World!');
}
);


// Return a fart sound
app.get('/fart', function (req, res) {
  res.send('Fart!');
}
);
