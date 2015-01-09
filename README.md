hobbo
=============
(pun for hub) is minimalistic WebSocket server.

Connection is simple.
```javascript
var ws = new WebSocket('ws://host:port/channel');
ws.onmessage = function (event) {console.log(event.data);};
```

It only handle raw text message and everything you send in the websocket is retransmitted to all other peer (except you) who is connected to the same channel.
```javascript
ws.onopen = function (event){
	ws.send('hello');
}
```

You can also use http POST method to broadcast data in a channel, it will be automaticly transmitted to all peer.
```javascript
xmlhttp.open("POST",'http://host:port/channel',true);
xmlhttp.setRequestHeader("Content-type","text/plain");
xmlhttp.send(data);
```

It support some get method that give report on how many connection per channel.
```javascript
xmlhttp.onreadystatechange=function(){
	if (xmlhttp.readyState==4 && xmlhttp.status==200)
	{
		console.log(xmlhttp.responseText);
		/*will show JSON.stringfy(numberOfPeer)*/
	}
}
xmlhttp.open("GET",'http://host:port/channel',true);
xmlhttp.send();
```

If you request root channel http://host:port/ , it will return a complete json report like
```javascript
{
	'ws://host:port/chan1' : 15,
	'ws://host:port/chan2' : 1
}
```

There is also on folder where you can put all your static file, a simple http GET with the exact name will return the file. It contains a javacript library that provide some already cooked function for websocket with hobbo server (it already know server url).
```javascript
var ws = connect(channel,function(message){/*called on incomming message*/});
get(channel,function(numpeer){/*called when result is delivered*/});
post(channel,'hello all peer');
```

There is an instance hosted at https://hobbo.herokuapp.com/ . Btw the project deploy out-the-box on heroku
