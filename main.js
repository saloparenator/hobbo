var peer = {};

var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 8080

console.log(__dirname);

/**
 * Provide static data from static folder
 */
app.use(express.static(__dirname + "/static/"))

/**
 * Support http post to websocket, raw text data
 */
app.use (function(req, res, next) {
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

/**
 * send every thing you receive here to all peer connected to web socket at same url
 */
app.post('/*', function(req, res)
{
  if (req.url in peer){
    for (var i in peer[req.url])
      var p = peer[req.url][i];
      p.send(req.body)
    res.status(200);
  }
  else{
    res.status(404);
  }
  res.end();
});

/**
 * return all connection status
 */
app.get('/', function(req,res){
  var host = 'wss://'+req.headers.host;
  var result = {};
  for (var url in peer){
    result[host+url] = peer[url].length;
  }
  res.end(JSON.stringify(result));
});

/**
 * return connection status
 */
app.get('/*', function(req,res){
  if (req.url in peer){
    res.status(200);
    res.end(JSON.stringify(peer[req.url].length));
  }
  else{
    res.status(404);
    res.end();
  }
});



/**
 * start server
 */
var server = http.createServer(app)
server.listen(port)
console.log("http server listening on %d", port)
var wss = new WebSocketServer({server: server})
console.log("websocket server created")

/**
 * while connection
 */
wss.on("connection", function(ws) {
  var url = ws.upgradeReq.url;
  console.log('connection at '+url);
  
  /**
   * register peer
   */
  if (url in peer)
    peer[url].push(ws);
  else
    peer[url] = [ws];  
  
  /**
   * On message reception, resend it to everyone in the same channel except same socket
   */
  ws.on('message', function(data, flags) {
    for (var i in peer[url]){
      var p = peer[url][i];
      p.send(data);
    }
  });

  /**
   * on connection close, remove peer
   */
  ws.on("close", function() {
    var toRemove = peer[url].indexOf(ws);
    if (toRemove!=-1)
      peer[url].splice(toRemove,1);
  })
})