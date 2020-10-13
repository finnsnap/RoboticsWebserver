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

var packet = {"r75" : {"newData" : true, "noData" : false},
              "r82" : {"newData" : true, "noData" : false},
              "rK9" : {"newData" : true, "noData" : false},
              "r9" : {"newData" : true, "noData" : false},
              "r7" : {"newData" : true, "noData" : false},
              "r3" : {"newData" : true, "noData" : false},
              "r12" : {"newData" : true, "noData" : false},
              "r16" : {"newData" : true, "noData" : false},
              "r35" : {"newData" : true, "noData" : false},
              "r40" : {"newData" : true, "noData" : false},
              "r42" : {"newData" : true, "noData" : false},
              "r44" : {"newData" : true, "noData" : false},
              "r53" : {"newData" : true, "noData" : false},
              "r68" : {"newData" : true, "noData" : false},
              "r74" : {"newData" : true, "noData" : false},
              "r81" : {"newData" : true, "noData" : false},
              "r85" : {"newData" : true, "noData" : false},
              "r88" : {"newData" : true, "noData" : false}
            };


esp32mqtt.on('message', function (topic, message) {
  try {
    var data = JSON.parse(message);
  
    // Sample message: "{"robotNumber":"1","batteryLevel":"33","contollerStatus":"Connected","tackleStatus":"tackled","timeSinceDataSend":2855571}"
    // Sample command: mosquitto_pub -h localhost -t esp32/output -m "{\"robotNumber\":\"1\",\"batteryLevel\":\"33\",\"contollerStatus\":\"Connected\",\"tackleStatus\":\"tackled\"}"
    
    //console.log("\nOld packet: " + JSON.stringify(packet));
    console.log("New data: " + JSON.stringify(data));

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
  }
  catch (err) {
    console.log("Error: " + err.message);
  }
})

function sendIntervalPacket(){
  try {
    io.sockets.emit('website', packet);
    //console.log("New interval packet: " + JSON.stringify(packet));

    for (var key of Object.keys(packet)) {
      if (!packet[key].newData) packet[key] = {"newData" : false, "noData" : true};
      if (packet[key].newData) packet[key].newData = false;
    }
  }
  catch (err) {
    console.log("Error: " + err.message);
  }
}

setInterval(sendIntervalPacket, 250);
