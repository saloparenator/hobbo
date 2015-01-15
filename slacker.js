var peer = {};
var id = 0;
var pool = {};

var WebSocketServer = require("ws").Server
var http = require("http")
var url = require("url")
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

app.all('/*',function(req, res){
  var query = {
    method : req.method,
    path : url.parse(req.url).pathname,
    url : req.url,
    param : req.param,
    data : req.data,
    reqid : id++,
    response : null
  };
  console.log(query);
  if (req.url in peer){
    var ws = peer[req.url];
    console.log(query);
    pool[query.id] = query;
    ws.send(JSON.stringify(query));
    while (pool[query.id].response===null){
      console.log('wait '+query.id);
    }
    res.status(200);
    res.end(pool[query.id].response);
  }
  else{
    res.status(404);
    res.end();
  }
});

/**
 * return all connection status
 */
app.get('/', function(req,res){
  var host = 'wss://'+req.headers.host;
  var result = [];
  for (var url in peer){
    result.push(url);
  }
  res.end(JSON.stringify(result));
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
   * register browser side server
   */
  if (url in peer)
    ws.close('already taken');
  else
    peer[url] = ws;  
  
  /**
   * On message reception, resend it to everyone in the same channel except same socket
   */
  ws.on('message', function(data, flags) {
    var obj = JSON.parse(data);
    pool[obj.id].response = data.response;
  });

  /**
   * on connection close, remove peer
   */
  ws.on("close", function() {
    delete peer[url];
  })
})
