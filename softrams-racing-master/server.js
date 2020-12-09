const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
var hsts = require('hsts');
const path = require('path');
var xssFilter = require('x-xss-protection');
var nosniff = require('dont-sniff-mimetype');
const request = require('request');

const app = express();

app.use(cors());
app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('x-powered-by');
app.use(xssFilter());
app.use(nosniff());
app.set('etag', false);
app.use(
  helmet({
    noCache: true
  })
);
app.use(
  hsts({
    maxAge: 15552000 // 180 days in seconds
  })
);
app.use(function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  return next();
});
app.use(
  express.static(path.join(__dirname, 'dist/softrams-racing'), {
    etag: false
  })
);

app.get('/api/members', (req, res) => {
  request('http://localhost:3000/members', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});


// TODO: Dropdown!
app.get('/api/teams', (req, res) => {
  request('http://localhost:3000/teams', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

// Submit Form!
app.post('/api/addMember', (req, res, options) => {
  let optionsHead = { 'Content-type': 'application/json' }
  request(
    {
      method: 'POST',
      url: 'http://localhost:3000/members',
      headers: optionsHead,
      body: req.body,
      json: true
    },
    (err, response, body) => {
      if (response.statusCode <= 500) {
        res.send(body);
      }
    }
  );

  //req.add(data);
});

// Submit Form!
app.post('/api/putMember', (req, res, options) => {
  let optionsHead = { 'Content-type': 'application/json' }
  request(
    {
      method: 'PUT',
      url: 'http://localhost:3000/members/'+req.body.params.id,
      headers: optionsHead,
      body: req.body.params.data,
      json: true
    },
    (err, response, body) => {
      if (response.statusCode <= 500) {
        res.send(body);
      }
    }
  );

});

app.post('/api/deleteMember', (req, res, options) => {
  request.delete('http://localhost:3000/members/'+JSON.stringify(req.body.params), (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
    }
  );

  //req.add(data);
});





app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/softrams-racing/index.html'));
});

app.listen('8000', () => {
  console.log('Vrrrum Vrrrum! Server starting!');
});
