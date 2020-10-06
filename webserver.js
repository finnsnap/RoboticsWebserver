var http = require('http').createServer(handler) //require http server, and create server with function handler()
var fs = require('fs') //require filesystem module
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
http.listen(8080) //listen to port 8080

function handler (req, res) { //create server
  fs.readFile(__dirname + '/index.html', function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}) //display 404 on error
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'}) //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
}

io.on('connection', function(socket) {  
  console.log('A user connected');
 
  socket.on('disconnect', function () {
     console.log('A user disconnected');
  });
});


var mqtt = require('mqtt')
var esp32mqtt  = mqtt.connect('mqtt://localhost')

esp32mqtt.on('connect', function () {
  esp32mqtt.subscribe('esp32/output') 
})

esp32mqtt.on('message', function (topic, message) {
  // message is Buffer
  var data = JSON.parse(message);
  // Sample message: '{"name":"Robot1", "ID":"33424", "batteryLevel":"100"}'
  
  console.log("Topic: " + topic + " \nMessage: " + message.toString() + "\nName: " + data.name);
  io.sockets.send(message.toString());
})

