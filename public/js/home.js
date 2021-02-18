const socket = io(); //load socket.io-client and connect to the host that serves the page
console.log("Started sockets");
var firstPacket = true;

socket.on('website',  function(message){    
  try {
    if (firstPacket){
      console.log("First packet: " + JSON.stringify(message));
      for (var key of Object.keys(message)) {
        if (message[key].dataStatus != 0) {
          var row = $('<tr/ id=' + key + '>');
          row.append($('<td/ class=table-success id=' + key + 'name>').html(key.replace('r', '')));
          row.append($('<td/ class=table-success id=' + key + 'batteryLevel>').html(message[key].batteryLevel));
          row.append($('<td/ class=table-success id=' + key + 'contollerStatus>').html(message[key].contollerStatus));
          row.append($('<td/ class=table-success id=' + key + 'tackleStatus>').html(message[key].tackleStatus));
        }
        else {
          var row = $('<tr/ id=' + key + '>');
          row.append($('<td/ class=table-active id=' + key + 'name>').html(key.replace('r', '')));
          row.append($('<td/ class=table-active id=' + key + 'batteryLevel>').html(""));
          row.append($('<td/ class=table-active id=' + key + 'contollerStatus>').html(""));
          row.append($('<td/ class=table-active id=' + key + 'tackleStatus>').html(""));
        }
        $('#summtable').append(row); 
      } 
      firstPacket = false;
    }
    else {
      // Sample message: "{"1":{"batteryLevel":"33","contollerStatus":"Connected","tackleStatus":"tackled","newData":true,"noData":false},"2":{"newData":false,"noData":true}, ..."
      console.log("New packet: " + JSON.stringify(message));
      for (var key of Object.keys(message)) {
        if (message[key].dataStatus == 0) {
            var row = $('<tr/ id=' + key + '>');
            row.append($('<td/ class=table-active id=' + key + 'name>').html(key.replace('r', '')));
            row.append($('<td/ class=table-active id=' + key + 'batteryLevel>').html(""));
            row.append($('<td/ class=table-active id=' + key + 'contollerStatus>').html(""));
            row.append($('<td/ class=table-active id=' + key + 'tackleStatus>').html(""));
            $('#' + key).replaceWith(row);
        }
        else if (message[key].dataStatus == 2) {
          var row = $('<tr/ id=' + key + '>');
          
          row.append($('<td/ class=table-success id=' + key + 'name>').html(key.replace('r', '')));
          
          row.append($('<td/ class=table-success id=' + key + 'batteryLevel>').html(message[key].batteryLevel));
          
          if (message[key].contollerStatus == "Disconnected") row.append($('<td/ class=table-info id=' + key + 'contollerStatus>').html(message[key].contollerStatus));
          else row.append($('<td/ class=table-success id=' + key + 'contollerStatus>').html(message[key].contollerStatus));
          
          if (message[key].tackleStatus == "Tackled") row.append($('<td/ class=table-danger id=' + key + 'tackleStatus>').html(message[key].tackleStatus));
          else row.append($('<td/ class=table-success id=' + key + 'tackleStatus>').html(message[key].tackleStatus));
          
          $('#' + key).replaceWith(row);
        }
      } 
    } 
  }
  catch(err) {
    console.log("Error: " + err.message);
  }  
})