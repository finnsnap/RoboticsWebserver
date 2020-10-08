var http = require('http');
var express = require("express");
var app = express();

var server = http.createServer(app);
// Pass a http.Server instance to the listen method
var io = require('socket.io').listen(server);

// The server should start listening
server.listen(8080);

// Register the index route of your app that returns the HTML file
app.get('/', function (req, res) {
  console.log("Homepage");
  res.sendFile(__dirname + '/public/index.html');
});

// Expose the node_modules folder as static resources (to access socket.io.js in the browser)
//app.use('/static', express.static('node_modules'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

// Handle connection
io.on('connection', function(socket) {  
  console.log('A user connected');
  
  socket.emit('news', "Test send stuff");

  socket.on('my other event', function (data) {
    console.log(data);
  });


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
  // Sample message: {"robotName":"ESP32","batteryLevel":"33","contollerStatus":"Connected","timeSinceReset":76038}
  
  console.log("\nTopic: " + topic + " \nMessage: " + message.toString() + "\nrobotName: " + data.robotName + "\nbatteryLevel: " + data.batteryLevel + "\ncontollerStatus: " + data.contollerStatus + "\ntimeSinceReset: " + data.timeSinceReset);
  io.sockets.send(message.toString());
})

