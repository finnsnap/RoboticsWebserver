const http = require('http');
const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const path = require('path');
const fb = require('./index.js');

//
var app = express();
app.use(bodyParser.json());

var server = http.createServer(app);

// Pass a http.Server instance to the listen method
var io = require('socket.io').listen(server);
// The server should start listening to the given port
server.listen(8081);

// Start and connect the mqtt server
var mqtt = require('mqtt');
const { fdatasync } = require('fs');
var esp32mqtt  = mqtt.connect('mqtt://localhost')

// Route the homepage html file
app.get('/', function (req, res) {
  console.log("Homepage");
  res.sendFile(__dirname + '/public/html/home.html');
});

// Route the robotinfo page html file
app.get('/robotinfo', function (req, res) {
  console.log("Robot Info");
  res.sendFile(__dirname + '/public/html/robotinfo.html');
});

// Route the reprogramming page html file
app.get('/reprogramming', function (req, res) {
  console.log("Reprogramming");
  res.sendFile(__dirname + '/public/html/reprogramming.html');
});


// Redirects for all CSS and JS files
app.use('/css', express.static(__dirname + '/node_modules/bootswatch/dist')); // redirect bootswatch CSS
app.use('/css', express.static(__dirname + '/public/css')); // redirect custom CSS
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/jquery-form/dist')); // redirect jquery-form JS
app.use('/js', express.static(__dirname + '/node_modules/mustache')); // redirect mustache JS
app.use('/js', express.static(__dirname + '/public/js')); // redirect custom JS

// Exposes public folder for uploading files
app.use('/public', express.static(__dirname + '/public'));


// Handle socketio connection event from a client
io.on('connection', function(socket) {  
  console.log('A user connected');
  io.sockets.emit('website', packet);

  socket.on('reprogramming', function (data) {
    data.id.forEach((checkbox) => {
      esp32mqtt.publish(checkbox, "p -" + data.file);
      console.log("Robot: " + checkbox + " Command:" + "p -" + data.file);
    });
  });

  // Handle disconnection event from a client
  socket.on('disconnect', function () {
     console.log('A user disconnected');
  });
});

// Handle mqtt connection event to mosquitto server 
esp32mqtt.on('connect', function () {
  esp32mqtt.subscribe('esp32/output') 
  esp32mqtt.subscribe('esp32/input') 
});

esp32mqtt.on('esp32input', function (topic, message) {
  console.log("MQTT input: " + data);
   
})

// JSON packet to hold data about all the robots
var packet = {"r75" : {"dataStatus" : 0},
              "r82" : {"dataStatus" : 0},
              "rK9" : {"dataStatus" : 0},
              "r9" : {"dataStatus" : 0},
              "r7" : {"dataStatus" : 0},
              "r3" : {"dataStatus" : 0},
              "r12" : {"dataStatus" : 0},
              "r16" : {"dataStatus" : 0},
              "r35" : {"dataStatus" : 0},
              "r40" : {"dataStatus" : 0},
              "r42" : {"dataStatus" : 0},
              "r44" : {"dataStatus" : 0},
              "r53" : {"dataStatus" : 0},
              "r68" : {"dataStatus" : 0},
              "r74" : {"dataStatus" : 0},
              "r81" : {"dataStatus" : 0},
              "r85" : {"dataStatus" : 0},
              "r88" : {"dataStatus" : 0}
            };

// Handle event when a message is recieved from an esp32
esp32mqtt.on('message', function (topic, message) {
  if (topic == "esp32/output"){
    try {
      var data = JSON.parse(message);
    
      // Sample message: "{"robotNumber":"1","batteryLevel":"33","contollerStatus":"Connected","tackleStatus":"tackled","timeSinceDataSend":2855571}"
      // Sample manual command: mosquitto_pub -h localhost -t esp32/output -m "{\"robotNumber\":\"r75\",\"batteryLevel\":\"33\",\"contollerStatus\":\"Connected\",\"tackleStatus\":\"tackled\"}"
      
      //console.log("\nOld packet: " + JSON.stringify(packet));
      //console.log("New data: " + JSON.stringify(data));

      if(packet.hasOwnProperty(data.robotNumber)){
        var key = data.robotNumber;
        delete data.robotNumber;
        packet[key] = data;
        packet[key].dataStatus = 2;
      }

      //console.log("Shortened data: " + JSON.stringify(data));
      //console.log("New esp packet: " + JSON.stringify(packet));
    }
    catch (err) {
      console.log("Error: " + err.message);
    }
  }
  else if (topic == "esp32/input") {
    console.log("New message: " + message);
  }
})


function sendIntervalPacket(){
  try {
    io.sockets.emit('website', packet);
    //console.log("New interval packet: " + JSON.stringify(packet));

    for (var key of Object.keys(packet)) {
      if (packet[key].dataStatus > 0) packet[key].dataStatus--;

      // if (!packet[key].newData) packet[key] = {"newData" : false, "noData" : true};
      // if (packet[key].newData) packet[key].newData = false;
    }
  }
  catch (err) {
    console.log("Error: " + err.message);
  }
}

// Sends a JSON packet at specified intervals
setInterval(sendIntervalPacket, 250);








fb.configure({
  removeLockString: true,
  otherRoots: [ ]
});

app.get('/b', function(req, res) {
  let file;
  if (req.query.r === '/tmp') {

      /*
       * OTHERROOTS
       * This is an example of a manually calculated path.
       */
      file = path.join(req.query.r,req.query.f);
  } else {
      file = path.join(dir,req.query.f);
  }
  res.sendFile(file);
});


var dir = process.cwd() + "/public/binaries";
fb.setcwd(dir);
app.get('/files', fb.get);




// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/binaries')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);//file.fieldname + '-' + Date.now() + path.extname(file.originalname));
}});
 
var upload = multer({ storage: storage })

// Upload single file
app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return res.send("Error uploading file.");
  }
  res.send("File is uploaded");
});

// Uploading multiple files
app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
  const files = req.files
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return res.send("Error uploading file.");
  }
  res.send("Files are uploaded");
});
