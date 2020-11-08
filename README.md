## Getting started
1. Clone the repo
```sh
git clone https://github.com/finnsnap/RoboticsWebserver.git
```
2. Install all the necessary nodejs modules
```sh
npm install
```
4. Start the webserver with nodemon
```sh
npx nodemon webserver.js
```

## Reprogramming
Send command --> Recieve response --> Display whether reprogramming was sucsessful or not
* https://stackoverflow.com/questions/34822599/optimum-way-to-write-long-javascript-variables-containing-html?noredirect=1&lq=1

## TODO
* Robot Information
    * Option to change robot names?
    * ESP32 Macaddress 
    * Change it so it does not update entire card every time new data is recieved
* Reprogramming
    * ~~Make file expolorer so you can see files that are currently on raspberry pi~~
    * Make reprogramming robots possible
    * Program all connected robots, or just one, or maybe even batches
    * Select from a list which robots to program
    * Send robot which file to reprogram with, dynamic choice of new file to upload

## Links
* https://techtutorialsx.com/2017/04/24/esp32-publishing-messages-to-mqtt-topic/
* https://getbootstrap.com/docs/4.5/getting-started/introduction/
* https://techtutorialsx.com/2017/04/29/esp32-sending-json-messages-over-mqtt/
* https://socket.io/
* https://randomnerdtutorials.com/esp32-web-server-spiffs-spi-flash-file-system/
* https://randomnerdtutorials.com/install-esp32-filesystem-uploader-arduino-ide/
* https://esp32.com/viewtopic.php?t=3316
* https://github.com/me-no-dev/ESPAsyncWebServer/issues/542
