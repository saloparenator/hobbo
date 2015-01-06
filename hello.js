var http = require('http');

var server = http.createServer(function(req, res) {
  res.end('Hello from NodeJS!\n');
  console.log('Someone visited our web server!');
  console.log('path:'+req.url);
  console.log('method:'+req.method);
})

server.listen(8080, '0.0.0.0');
console.log("NodeJS web server running on 0.0.0.0:80");