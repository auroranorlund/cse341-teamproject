const express = require('express');
const app = express();
const env = require('dotenv').config();
const port = process.env.PORT || 8080;
const mongodb = require('./data/database');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use('/', require('./routes'));

app.get('/', (req, res) => {
  res.send('Welcome to the Online Store API');
});

process.on('uncaughtException', (err, origin) => {
  console.log(
    process.stderr.fd,
    `Caught exception: ${err}\n` + `Exception origin: ${origin}`,
  );
});

mongodb.initDatabase(err => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log('Web server is listening at port ' + port);
    console.log('Database is connected!');
  }
});
