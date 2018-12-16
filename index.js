const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const opn = require('opn');
//const got = require('got');
//const natural = require('natural');
const _ = require('lodash');
//const create = require('./fakerObjects/dataFakerCreator.js');



const port = 3001;
const url = 'http://localhost:' + port;

// Express app setup
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/displayPage'));
app.use(express.static(__dirname + '/operations'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/displayPage/index.html');
});

app.get('/clear', function(req, res) {
    console.log('clear req ', req);
    res.send('cleared');
});

app.post('/index', function(req, res) {
    console.log('index req ', req.body.urlIP);
    const obj = {};
    obj['request'] = 'indexed';
    res.json(obj);
});

app.post('/search', function(req, res) {
    console.log('search req ', req.body.words);
    const obj = {};
    obj['request'] = 'searched';
    res.json(obj);
    res.end();
});

// Tell the server what port to run on
server.listen(port);

// Open the display page in a browser
try {
    opn(url);
} catch (e) {
    console.log('Please open ', url, ' in a browser.');
}
