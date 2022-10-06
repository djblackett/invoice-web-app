// Express server on port 3000
const express = require('express');
const app = express();
const port = 3000;

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
