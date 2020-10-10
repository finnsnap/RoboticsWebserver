var http = require('http');
var express = require("express");
var app = express();

var server = http.createServer(app);

// Pass a http.Server instance to the listen method
var io = require('socket.io').listen(server);
// The server should start listening
server.listen(8080);

// Start and connect the mqtt server
var mqtt = require('mqtt');
const { fdatasync } = require('fs');
var esp32mqtt  = mqtt.connect('mqtt://localhost')

// Register the index route that returns the HTML file
app.get('/', function (req, res) {
  console.log("Homepage");
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/robotinfo', function (req, res) {
  console.log("Robot Info");
  res.sendFile(__dirname + '/public/robotinfo.html');
});
app.get('/reprogramming', function (req, res) {
  console.log("Reprogramming");
  res.sendFile(__dirname + '/public/reprogramming.html');
});

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootswatch/dist')); // redirect CSS bootstrap

// Handle connection
io.on('connection', function(socket) {  
  console.log('A user connected');
  io.sockets.emit('website', packet);

  socket.on('my other event', function (data) {
    console.log(data);
  });

  socket.on('disconnect', function () {
     console.log('A user disconnected');
  });
});

esp32mqtt.on('connect', function () {
  esp32mqtt.subscribe('esp32/output') 
})

var packet = {"r1" : {"newData" : true, "noData" : false},
              "r2" : {"newData" : true, "noData" : false},
              "r3" : {"newData" : true, "noData" : false},
              "r4" : {"newData" : true, "noData" : false},
              "r5" : {"newData" : true, "noData" : false}
            };


esp32mqtt.on('message', function (topic, message) {
  var data = JSON.parse(message);
  // Sample message: "{"robotNumber":"1","batteryLevel":"33","contollerStatus":"Connected","tackleStatus":"tackled","timeSinceDataSend":2855571}"
  // Sample command: mosquitto_pub -h localhost -t esp32/output -m "{\"robotNumber\":\"1\",\"batteryLevel\":\"33\",\"contollerStatus\":\"Connected\",\"tackleStatus\":\"tackled\"}"
  
  //console.log("\nOld packet: " + JSON.stringify(packet));
  //console.log("New data: " + JSON.stringify(data));

  if(packet.hasOwnProperty(data.robotNumber)){
    var key = data.robotNumber;
    delete data.robotNumber;
    packet[key] = data;
    packet[key].newData = true;
    packet[key].noData = false;
  }
  
  //console.log("Shortened data: " + JSON.stringify(data));
  //console.log("New esp packet: " + JSON.stringify(packet));

  //io.sockets.emit('website', packet);
})

function sendIntervalPacket(){
  
  io.sockets.emit('website', packet);
  console.log("New interval packet: " + JSON.stringify(packet));

  for (var key of Object.keys(packet)) {
    if (!packet[key].newData) packet[key] = {"newData" : false, "noData" : true};
    if (packet[key].newData) packet[key].newData = false;
  }
}

setInterval(sendIntervalPacket, 250);
