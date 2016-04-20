"use strict";

const express = require('express');
const fs = require('fs');
const app = express();
const port = 53900;

// serve static demo at all html endpoints (react-router)
app.get('/*', (req, res, next) => {
  if (req.headers.accept.search('text/html') === -1) {
    return next();
  }

  const file = fs.readFileSync(__dirname + '/index.html');

  res.header('Content-Type', 'text/html');
  res.send(file);
});

app.use(express.static('demos'));

const emails = [
  {from: 'Agent<foo@gmail.com>', subject: 'I rendered this easily', message: 'lorem ipsum foo bar dude', id: 'ab23'},
  {from: 'Orange<italy@gmail.com>', subject: 'Colocation ftw', message: 'Dude. Secret message here yo bro', id: 'cd92'},
];

app.get('/api/emails', (req, res) => {
  setTimeout(function() {
    res.send(emails);
  }, 1);
});

app.get('/api/email/:id', (req, res) => {
  let email;

  emails.forEach((e, i) => {
    if (e.id === req.params.id) {
      email = emails[i];
    }
  });

  res.json(email);
});

// initialize server
app.listen(port, () => {
  // const command = /^win/.test(process.platform)? 'explorer' : 'open';

  console.log('TestSuite available at http://localhost:%s', port);
});
