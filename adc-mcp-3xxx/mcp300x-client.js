/*
  MCP3008 ADC temperature and humidity reader

  Reads two channels of an MCP3008 analog-to-digital converter
  and prints them out. Reads temperature and humidity using
 the Analog Devices TMP36 and a potentiometer.
 
 Example derived from the datasheets, and from numerous examples,
 including Adafruit, Bildr, the Arduino forums, and others:
 TMP36 datasheet:http://www.ladyada.net/media/sensors/TMP35_36_37.pdf
 Adafruit on TMP36: http://learn.adafruit.com/tmp36-temperature-sensor/
 my own example for Arduino: https://github.com/tigoe/SensorExamples/blob/master/EnvironmentalSensors/TempHumiditySensors/TempHumiditySensors.ino
 Circuit:
 * TMP36 on ADC input 0
 * potentiometer input 2

  created 3 March 2020
  modified 24 Jan 2021
  by Tom Igoe
*/

const mcpadc = require('mcp-spi-adc');  // include the MCP SPI library
const sampleRate = { speedHz: 20000 };  // ADC sample rate
let device = {};          // object for device characteristics
let supplyVoltage = 3.3;  // analog reference voltage
let resolution = 1.0;     // A-to-D resolution
let readingInterval;      // interval to do readings (initialized at bottom)

const https = require('https');
// change the hostname to your own:
let hostName = '';

/*
	the callback function to be run when the server response comes in.
	this callback assumes a chunked response, with several 'data'
	events and one final 'end' response.
*/
function getServerResponse(response) {
   // when the final chunk comes in, print it out:
   response.on('end', function (data) {
      console.log(data);
   });
}

// open two ADC channels:
let tempSensor = mcpadc.open(0, sampleRate, addNewChannel);
let potentiometer = mcpadc.open(2, sampleRate, addNewChannel);

// callback for ADC open() commands. Doesn't do anything here:
function addNewChannel(error) {
   if (error) throw error;
}

// callback function for tempSensor.read():
function getTemperature(error, reading) {
   if (error) throw error;
   // range is 0-1. Convert to Celsius (see TMP36 data sheet for details)
   let temperature = (reading.value * supplyVoltage - 0.5) * 100;
   // convert to a floating point number of 2 decimal point precision:
   device.temperature = Number(temperature.toFixed(2));
}

// callback function for humiditySensor.read():
function getPotentiometer(error, reading) {
   if (error) throw error;
    // convert to a floating point number of 2 decimal point precision:
   device.potentiometer = Number(reading.toFixed(2));
}

// get sensor readings into the object called device:
function getReadings() {
   // get readings:
   tempSensor.read(getTemperature);
   potentiometer.read(getPotentiometer);
   // if they're both numbers:
   if (!isNaN(device.temperature) && !isNaN(device.potentiometer)) {
      // print them and send to server:
      console.log(device);
      sendToServer(JSON.stringify(device));
      // stop reading:
      clearInterval(readingInterval);
   }
}

// assemble the HTTPS request and send it:
function sendToServer(dataToSend) {
  
   /*
    set up the options for the request.
    the full URL in this case is:
    http://example.com:443/data
   */
   var options = {
      host: hostName,
      port: 443,
      path: '/data',
      method: 'POST',
      headers: {
         'User-Agent': 'nodejs',
         'Content-Type': 'application/json',
         'Content-Length': dataToSend.length
      }
   };

   var request = https.request(options, getServerResponse);	// start it
   request.write(dataToSend);			// send the data
   request.end();			            // end it

}

// set an interval to keep running. The callback function (getReadings)
// will clear the interval when it gets good readings:
readingInterval = setInterval(getReadings, 1000);