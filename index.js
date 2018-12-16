const express = require('express');
const app = express();
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

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/displayPage/index.html');
});



// Tell the server what port to run on
server.listen(port);

// Open the display page in a browser
try {
    opn(url);
} catch (e) {
    console.log('Please open ', url, ' in a browser.');
}
