
var hostws = location.origin.replace(/^http/, 'ws');
var hostjx = location.origin;
var xmlhttp=new XMLHttpRequest();

function connect(channel,funk){
    var ws = new WebSocket(hostws+'/'+channel);
    ws.onmessage = function (event) {funk(event.data);};
    return ws;
}

function get(channel,funk){
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            funk(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET",hostjx+'/'+channel,true);
    xmlhttp.send();
}

function post(channel,data){
    xmlhttp.open("POST",hostjx+'/'+channel,true);
    xmlhttp.setRequestHeader("Content-type","text/plain");
    xmlhttp.send(data);
}
