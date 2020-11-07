## Getting started
Download code
npm i
npx nodemon webserver.js to start webserver
## Links
* https://techtutorialsx.com/2017/04/24/esp32-publishing-messages-to-mqtt-topic/
* https://getbootstrap.com/docs/4.5/getting-started/introduction/
* https://techtutorialsx.com/2017/04/29/esp32-sending-json-messages-over-mqtt/
* https://socket.io/
* https://randomnerdtutorials.com/esp32-web-server-spiffs-spi-flash-file-system/
* https://randomnerdtutorials.com/install-esp32-filesystem-uploader-arduino-ide/
* https://esp32.com/viewtopic.php?t=3316
* https://github.com/me-no-dev/ESPAsyncWebServer/issues/542

## Reprogramming
Send command --> Recieve response --> Display whether reprogramming was sucsessful or not

## TODO
* Make Robot Information page respond to actual data, all robots will be displayed no matter what? Or only display connected robots, make all robot info dynamic and actually from robot messages
    * Option to change robot names?
    * ESP32 Macaddress 
* Reprogramming
    * Make file expolorer so you can see files that are currently on raspberry pi
    * Make reprogramming robots possible
    * Program all connected robots, or just one, or maybe even batches
    * Select from a list which robots to program
    * Send robot which file to reprogram with, dynamic choice of new file to upload
