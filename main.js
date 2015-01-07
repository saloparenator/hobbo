
var port = process.env.PORT || 8080;
//var url = process.env.IP || '0.0.0.0';

console.log("B==D")

var http = require("http");
var express = require("express");
var expressws = require("express-ws");

var app = expressws(express());

app.use(express.static(__dirname + "/"));
app.get('/', function(req, res){
  res.send('hello world');
  console.log('get');
});

app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
  });
  console.log('socket', req.testing);
});

var server = http.createServer(app);
server.listen(port);;
console.log("http server listening on %d", port);
