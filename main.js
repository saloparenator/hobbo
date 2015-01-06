var port = process.env.PORT || 8080;
var url = process.env.IP || '0.0.0.0';

var http = require('http');

var server = http.createServer(function(req, res) {
  res.end('Hello from NodeJS!\n');
  console.log('Someone visited our web server!');
  console.log('path:'+req.url);
  console.log('method:'+req.method);
})

server.listen(port, url);
console.log("NodeJS web server running on "+url+':'+port);