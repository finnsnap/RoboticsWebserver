const http = require('http');
const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const path = require('path');
const fb = require('./index.js');

var app = express();
app.use(bodyParser.json());

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
  res.sendFile(__dirname + '/public/html/home.html');
});
app.get('/robotinfo', function (req, res) {
  console.log("Robot Info");
  res.sendFile(__dirname + '/public/html/robotinfo.html');
});
app.get('/reprogramming', function (req, res) {
  console.log("Reprogramming");
  res.sendFile(__dirname + '/public/html/template.html');
});

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootswatch/dist')); // redirect CSS bootstrap
app.use('/css', express.static(__dirname + '/public/css')); // redirect CSS bootstrap
app.use('/js', express.static(__dirname + '/public/js')); // redirect CSS bootstrap
app.use('/js', express.static(__dirname + '/node_modules/jquery-form/dist')); // redirect CSS bootstrap


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








fb.configure({
  removeLockString: true,

  /*
   * Example of otherRoots.
   * The other roots are listed and displayed, but their
   * locations need to be calculated by the server.
   * See OTHERROOTS in the app.
   */
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


var dir =  "/home/finnsnap/RoboticsWebserver/public"
fb.setcwd(dir);

app.get('/files', fb.get);




// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/binaries')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);//file.fieldname + '-' + Date.now() + path.extname(file.originalname));
}
})
 
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
})

// Uploading multiple files
app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
  const files = req.files
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return res.send("Error uploading file.");
  }
  res.send("Files are uploaded");
})