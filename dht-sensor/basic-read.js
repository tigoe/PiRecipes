/*
  DHT11/22/AMS2302 sensor reader

  Uses node-dht-sensor library
  https://github.com/momenso/node-dht-sensor


  created 10 Nov 2020
  by Tom Igoe
*/

// initialize the library:
let sensorLib = require("node-dht-sensor");

//  set up the sensor:
let sensor = {
  name: "DHT11",
  type: 22,       // sensor type
  pin: 4,         // R.Pi GPIO pin
  temperature: 0,
  humidity: 0
};

function readSensor() {
  // read the sensor:
  var reading = sensorLib.read(sensor.type, sensor.pin);
  // put the results back in the sensor object:
  sensor.temperature = reading.temperature.toFixed(2);
  sensor.humidity = reading.humidity.toFixed(1);
  console.log(sensor);
}

setInterval(readSensor, 2000);

