
var port = process.env.PORT || 8080;
//var url = process.env.IP || '0.0.0.0';

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
