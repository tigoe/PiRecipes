/*
   SSD1306 OLED Clock
   Demonstrates the text functions of the oled-i2c-bus library

   created 24 Feb 2020
   by Tom Igoe
*/

const i2c = require('i2c-bus');
const i2cBus = i2c.openSync(1);
const screen = require('oled-i2c-bus');
const font = require('oled-font-5x7');

var opts = {
   width: 128,     // screen width and height
   height: 64,
   address: 0x3C  // I2C address:check your particular model
};

// make an instance of the OLED library
var oled = new screen(i2cBus, opts);

function showTime() {
   // clear the screen:
   oled.clearDisplay();
   // set cursor to x = 0 y = 0:
   oled.setCursor(0, 0);
   // generate new datetime object:
   let now = new Date();
   // make a string of th time:
   let time = now.getHours() + ':'
      + now.getMinutes() + ':'
      + now.getSeconds();
   // write it to the screen:
   oled.writeString(font, 1, time, 1, true);
}

// update once per second:
setInterval(showTime, 1000);