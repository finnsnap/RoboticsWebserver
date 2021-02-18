const socket = io(); //load socket.io-client and connect to the host that serves the page
        console.log("Started sockets");
        var firstPacket = true;

        socket.on('website', function (message) {
          try {
            if (firstPacket) {
              console.log("First packet: " + JSON.stringify(message));
              
              for (var key of Object.keys(message)) {
                var robotData = {
                    cardID: key,
                    data: "bg-danger",
                    name: key.replace('r', ''),
                    contoller: "bg-info",
                    tackle: "bg-info",
                    battery: "bg-info",
                    position: "",
                    macaddress: "",
                    ipaddress: "",
                    version: ""
                }
                
                if (message[key].dataStatus != 0) {
                  robotData.data = "bg-success";
                  
                  if (message[key].contollerStatus == "Connected") robotData.contoller = "bg-success";
                  else robotData.contoller = "bg-danger";
                  
                  if (message[key].tackleStatus == "Tackled") robotData.tackle = "bg-danger";
                  else robotData.tackle = "bg-success";


                  robotData.battery = message[key].batteryLevel;
                  //robotData.position = message[key].batteryLevel;
                  robotData.macaddress = message[key].espMacAddress;
                  robotData.ipaddress = message[key].ipAddress;
                  robotData.version = message[key].codeVersion;
                }
                console.log(robotData.name);
                $("#cards").append(Mustache.render($("#template").html(), robotData));
              }
              firstPacket = false;
            }
            else {
              // Sample message: "{"1":{"batteryLevel":"33","contollerStatus":"Connected","tackleStatus":"tackled","newData":true,"noData":false},"2":{"newData":false,"noData":true}, ..."
              console.log("New packet: " + JSON.stringify(message));

              for (var key of Object.keys(message)) {
                var robotData = {
                    cardID: key,
                    data: "bg-danger",
                    name: key.replace('r', ''),
                    contoller: "bg-info",
                    tackle: "bg-info",
                    battery: "bg-info",
                    position: "",
                    macaddress: "",
                    ipaddress: "",
                    version: ""
                }
                
                if ($('#' + key + "title").hasClass("bg-danger") && message[key].dataStatus == 2) {

                    robotData.data = "bg-success";

                    if (message[key].contollerStatus == "Disconnected") robotData.contoller = "bg-danger";
                    else robotData.contoller = "bg-success";

                    if (message[key].tackleStatus == "Tackled") robotData.tackle = "bg-danger";
                    else robotData.tackle = "bg-success";

                    robotData.battery = message[key].batteryLevel;
                    //robotData.position = message[key].batteryLevel;
                    robotData.macaddress = message[key].espMacAddress;
                    robotData.ipaddress = message[key].ipAddress;
                    robotData.version = message[key].codeVersion;
                    
                    $('#' + key).replaceWith(Mustache.render($("#template").html(), robotData));

                }

                if ($('#' + key + "title").hasClass("bg-success") && message[key].dataStatus == 0) {
                    $('#' + key).replaceWith(Mustache.render($("#template").html(), robotData));
                }
            
              }
            }
          }
          catch (err) {
            console.log("Error: " + err.message);
          }
        })