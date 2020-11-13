## Getting started

### Prerequisites
1. Raspberry Pi setup as routed accesss point. Helpful tutorial here [Setting up a Raspberry Pi as a routed wireless access point](https://www.raspberrypi.org/documentation/configuration/wireless/access-point-routed.md)
2. Mosquitto broker installed [How to Install Mosquitto Broker on Raspberry Pi](https://randomnerdtutorials.com/how-to-install-mosquitto-broker-on-raspberry-pi/)
3. Nodejs and npm installed

### Installation
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

## Packet Format Changes to be Made
### Options
1. Only send minimal data that has changed
    From the esp32 the packets should have the robotNumber to identify them and then any data that has **changed** with the robot

    Example of a json packet coming from an esp32 where the batteryLevel, controllerStatus, and tackleStatus have all changed
    ```json
    {
        "robotNumber" : "r75",
        "batteryLevel" : "33",
        "contollerStatus" : "Connected",
        "tackleStatus" : "Tackled"
    }
    ```

    Example of a json packet coming from an esp32 where nothing about the robot has changed
    ```json
    {
        "robotNumber" : "r75"
    }
    ```

2. **Send all data from esp32 no matter what and have webserver decide if it has changed. If it has not changed just send basic newData and noData. If it has changed send newData, noData and full esp32 JSON**
3. Send all data from esp32 through to client and have them decide if it has changed.

From the webserver the packets contain any new data from the esp32's as well as newData and noData which help determine if there data and the status of that data. See the table below for the possible states

| Current System State                            | newData | noData |
|-------------------------------------------------|---------|--------|
| Not used                                        | false   | false  |
| No data **has been** coming from esp32          | false   | true   |
| There is new data from the esp32                | true    | false  |
| Data has **just** stopped coming from esp32     | true    | true   |


An example of an empty json packet coming from the weberver

```json
{
    "r75" : {"newData":false,"noData":true},
    "r82" : {"newData":false,"noData":true},
    "rK9" : {"newData":false,"noData":true},
    "r9"  : {"newData":false,"noData":true},
    "r7"  : {"newData":false,"noData":true},
    "r3"  : {"newData":false,"noData":true},
    "r12" : {"newData":false,"noData":true},
    "r16" : {"newData":false,"noData":true},
    "r35" : {"newData":false,"noData":true},
    "r40" : {"newData":false,"noData":true},
    "r42" : {"newData":false,"noData":true},
    "r44" : {"newData":false,"noData":true},
    "r53" : {"newData":false,"noData":true},
    "r68" : {"newData":false,"noData":true},
    "r74" : {"newData":false,"noData":true},
    "r81" : {"newData":false,"noData":true},
    "r85" : {"newData":false,"noData":true},
    "r88" : {"newData":false,"noData":true}
}
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
    * ~~~Make reprogramming robots possible~~~
    * ~~~Program all connected robots, or just one, or maybe even batches~~~
    * ~~~Select from a list which robots to program~~~
    * ~~~Send robot which file to reprogram with, dynamic choice of new file to upload~~~
    * Response from webserver (and esp32?) when uploading new code
    * Compile code on raspberry pi??

## Links
* https://techtutorialsx.com/2017/04/24/esp32-publishing-messages-to-mqtt-topic/
* https://getbootstrap.com/docs/4.5/getting-started/introduction/
* https://techtutorialsx.com/2017/04/29/esp32-sending-json-messages-over-mqtt/
* https://socket.io/
* https://randomnerdtutorials.com/esp32-web-server-spiffs-spi-flash-file-system/
* https://randomnerdtutorials.com/install-esp32-filesystem-uploader-arduino-ide/
* https://esp32.com/viewtopic.php?t=3316
* https://github.com/me-no-dev/ESPAsyncWebServer/issues/542
* https://www.javascripttutorial.net/javascript-dom/javascript-checkbox/

* [Setting up a Raspberry Pi headless](https://www.raspberrypi.org/documentation/configuration/wireless/headless.md)
* [Setting up a Raspberry Pi as a routed wireless access point](https://www.raspberrypi.org/documentation/configuration/wireless/access-point-routed.md)
* [Introduction to IoT: Build an MQTT Server Using Raspberry Pi](https://appcodelabs.com/introduction-to-iot-build-an-mqtt-server-using-raspberry-pi)
* [Friendly toggle to enable/disable Raspberry Pi's as an access point](https://www.raspberrypi.org/forums/viewtopic.php?t=266214)
* [Node.js and Raspberry Pi - Webserver with WebSocket](https://www.w3schools.com/nodejs/nodejs_raspberrypi_webserver_websocket.asp)
* [mqtt-panel](https://github.com/fabaff/mqtt-panel)
* [Node.js + Nginx](https://stackoverflow.com/questions/5009324/node-js-nginx-what-now)
