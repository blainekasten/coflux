"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const exec = require('child_process').exec;
const fs = require('fs');
const React = require('react-dom/server');
const prettyJSON = require('prettyjson');
const glob = require('glob');
const app = express();
const read = fs.readFileSync;
const port = 53900;

// serve static demos
app.use(express.static('demos'));

app.get('/api/products', (req, res) => {
  setTimeout(function() {
    res.send([
      {title: 'foo', value: 12},
      {title: 'bar', value: 40},
    ]);
  }, 4200);
});

// initialize server
app.listen(port, () => {
  const command = /^win/.test(process.platform)? 'explorer' : 'open';

  console.log('TestSuite available at http://localhost:%s', port);
});
