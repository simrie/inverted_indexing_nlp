"use strict";

/*
    Express node.js app runs backend indexing operations,
    which upon startup opens a default browser to load
    an angular.js and bootstrap user interface.
 */

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const opn = require('opn');
const clear = require('./operations/clear');
const indexing = require('./operations/indexing');
const searching = require('./operations/searching');
const util = require('util');

// Express app setup
const port = 3001;
const url = 'http://localhost:' + port;
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/displayPage'));
app.use(express.static(__dirname + '/app'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/displayPage/index.html');
});

app.get('/clear', function(req, res) {
    res.send(clear.doClear());
});

app.post('/index', function(req, res) {
    //TODO: make this send stat message after indexing
    const url = req.body.urlIP;
    io.emit('result', 'Indexing...');

    function crawl(url) {
        const done = indexing.doIndex(url);
        console.log('done is ', done);
        return done;
    }
    const emitResult = (done) => {
        const msg = indexing.getStatMessage();
        console.log('done: ', done, msg);
        io.emit('result', msg);
    };
    // setting a likely interval for it to be done
    //setTimeout(emitResult, 8000, 'timeout');
    // because promise is not working to send the done message
    const crawls = util.promisify(crawl);
    crawls(url).then(() => emitResult).catch(console.log);


});

app.post('/search', function(req, res) {
    io.emit('result', '');
    res.json(searching.doSearch(req.body.words));
    res.end();
});

// socket.io setup
io.on('connection', function(client) {
    console.log('Client connected...');
    client.on('join', function(data) {
        console.log('join data received ' + data);
        const welcome = `Please enter a web site to index.`;
        client.emit('result', welcome);
    });
    client.on('disconnect', function(){
        console.log('disconnected');
    });
});

// Tell the server what port to run on
server.listen(port);


// Open the display page in a browser on startup
try {
    opn(url);
} catch (e) {
    console.log('Please open ', url, ' in a browser.');
}
