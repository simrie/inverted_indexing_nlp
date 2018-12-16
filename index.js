"use strict";

/*
    Express node.js app runs backend indexing operations,
    which upon startup opens a default browser to load
    an angular.js and bootstrap user interface.
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const opn = require('opn');
const clear = require('./operations/clear');
const indexing = require('./operations/indexing');
const searching = require('./operations/searching');

// Express app setup
const port = 3001;
const url = 'http://localhost:' + port;
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/displayPage'));
app.use(express.static(__dirname + '/operations'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/displayPage/index.html');
});

app.get('/clear', function(req, res) {
    res.send(clear.doClear());
});

app.post('/index', function(req, res) {
    res.json(indexing.doIndex(req.body.urlIP));
    res.end();
});

app.post('/search', function(req, res) {
    res.json(indexing.doIndex(req.body.words));
    res.end();
});

server.listen(port);

// Open the display page in a browser on startup
try {
    opn(url);
} catch (e) {
    console.log('Please open ', url, ' in a browser.');
}
