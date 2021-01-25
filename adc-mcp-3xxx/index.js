/*
  MCP3008 ADC reader

  Reads two channels of an MCP3008 analog-to-digital converter
  and prints them out. 

  created 17 Feb 2019
  by Tom Igoe
*/

const mcpadc = require('mcp-spi-adc');  // include the MCP SPI library
const sampleRate = { speedHz: 20000 };  // ADC sample rate
let device = {};      // object for device characteristics
let channels = [];    // list for ADC channels

// open two ADC channels and push them to the channels list:
let tempSensor = mcpadc.open(0, sampleRate, addNewChannel);
channels.push(tempSensor);
let potentiometer = mcpadc.open(2, sampleRate, addNewChannel);
channels.push(potentiometer);

// callback for open() commands. Doesn't do anything here:
function addNewChannel(error) {
  if (error) throw error;
}

// function to read and convert sensors:
function checkSensors() {
  // callback function for tempSensor.read():
  function getTemperature(error, reading) {
    if (error) throw error;
    // range is 0-1. Convert to Celsius (see TMP36 data sheet for details)
    device.temperature = (reading.value * 3.3 - 0.5) * 100;
  }
  
  // callback function for potentiometer.read():
  function getKnob(error, reading) {
    if (error) throw error;
    device.potentiometer = reading.value;
  }

  // make sure there are two ADC channels open to read,
  // then read them and print the result:
  if (channels.length > 1) {
    tempSensor.read(getTemperature);
    potentiometer.read(getKnob);
    console.log(device);
  }
}

// set an interval once a second to read the sensors:
setInterval(checkSensors, 1000);