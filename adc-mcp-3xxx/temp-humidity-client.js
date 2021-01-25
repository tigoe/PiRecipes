/*
  MCP3008 ADC temperature and humidity reader

  Reads two channels of an MCP3008 analog-to-digital converter
  and prints them out. Reads temperature and humidity using
 the Analog Devices TMP36 and the Honeywell HIH-4030.
 
 Example derived from the datasheets, and from numerous examples,
 including Adafruit, Bildr, the Arduino forums, and others:
 TMP36 datasheet:http://www.ladyada.net/media/sensors/TMP35_36_37.pdf
 HIH-4030 datasheet:https://www.sparkfun.com/datasheets/Sensors/Weather/SEN-09569-HIH-4030-datasheet.pdf
 Adafruit on TMP36: http://learn.adafruit.com/tmp36-temperature-sensor/
 Bildr on HIH-4030: http://bildr.org/2012/11/hih4030-arduino/
 Arduino forum example for HIH-4030: http://forum.arduino.cc/index.php/topic,19961.0.html
 my own example for Arduino: https://github.com/tigoe/SensorExamples/blob/master/EnvironmentalSensors/TempHumiditySensors/TempHumiditySensors.ino
 Circuit:
 * TMP36 on ADC input 0
 * HIH-4030 on ADC input 2

  created 3 March 2020
  by Tom Igoe
*/

const mcpadc = require('mcp-spi-adc');  // include the MCP SPI library
const sampleRate = { speedHz: 20000 };  // ADC sample rate
let device = {};          // object for device characteristics
let supplyVoltage = 3.3;  // analog reference voltage
let resolution = 1.0;     // A-to-D resolution
let readingInterval;      // interval to do readings (initialized at bottom)

const https = require('https');
// change the hostname, macAddress, and sessionKey to your own:
let hostName = '';
let macAddress = '';
let sessionKey = '';

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
let humiditySensor = mcpadc.open(2, sampleRate, addNewChannel);

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
function getHumidity(error, reading) {
   if (error) throw error;
   let rhSlope = 0.0062 * supplyVoltage; // humidity sensor slope
   let rhOffset = 0.16 * supplyVoltage;  // humidity sensor offset

   // convert to voltage:
   var humidityVoltage = (reading.value / resolution) * supplyVoltage;
   // convert to relative humidity (rH): 
   var sensorRH = (humidityVoltage - rhOffset) / rhSlope;
   // adjust for temperature:
   var trueRH = sensorRH / (1.0546 - (0.00216 * device.temperature));
   // convert to a floating point number of 2 decimal point precision:
   device.humidity = Number(trueRH.toFixed(2));
}

// get sensor readings into the object called device:
function getReadings() {
   // get readings:
   tempSensor.read(getTemperature);
   humiditySensor.read(getHumidity);
   // if they're both numbers:
   if (!isNaN(device.temperature) && !isNaN(device.humidity)) {
      // print them and send to server:
      console.log(device);
      sendToServer(JSON.stringify(device));
      // stop reading:
      clearInterval(readingInterval);
   }
}

// assemble the HTTPS request and send it:
function sendToServer(dataToSend) {
   // make the POST data a JSON object and stringify it:
   var postData = JSON.stringify({
      'macAddress': macAddress,
      'sessionKey': sessionKey,
      'data': dataToSend
   });

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
         'Content-Length': postData.length
      }
   };

   var request = https.request(options, getServerResponse);	// start it
   request.write(postData);			// send the data
   request.end();			            // end it

}

// set an interval to keep running. The callback function (getReadings)
// will clear the interval when it gets good readings:
readingInterval = setInterval(getReadings, 1000);