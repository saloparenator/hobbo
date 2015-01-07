
var db = {};

var port = process.env.PORT || 8080;
//var url = process.env.IP || '0.0.0.0';

console.log("B==D")

var express = require("express");

var app = express();

app.use(function (req, res, next) {
    var data='';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { 
       data += chunk;
    });

    req.on('end', function() {
        req.body = data;
        next();
    });
});

app.get('/*', function(req, res, next){
  console.log(db);
  if (req.url in db){
    res.end(db[req.url]);
  }
  else
    res.end();
});

app.post('/*', function(req, res, next){
  console.log(req.body);
  db[req.url] = req.body
  res.end('ok');
});

app.listen(port);;
console.log("http server listening on %d", port);


/*
console.log("B==D")

var express = require("express");
var expressws = require("express-ws");

var app = expressws(express());


app.use(function (req, res, next) {
  console.log('middleware');
  req.testing = 'testing';
  return next();
});

app.get('/', function(req, res, next){
  console.log('get route', req.testing);
  res.end();
});

app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
  });
  console.log('socket', req.testing);
});

app.listen(port);;
console.log("http server listening on %d", port);
*/

/*
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});
*/

/*
var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express();

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(8080);

var wss = new WebSocketServer({server: server, verifyClient :function(info,cb){return true;}});
wss.on('connection', function(ws) {
  var id = setInterval(function() {
    ws.send(JSON.stringify(process.memoryUsage()), function() { console.log("shit"); });
  }, 100);
  console.log('started client interval');
  ws.on('close', function() {
    console.log('stopping client interval');
    clearInterval(id);
  });
});
*/