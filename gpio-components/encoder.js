/*
  Rotary encoder
  Uses pre-ES6 function notation to make the listeners
  clearer for beginners.

  created 5 Apr 2021
  by Tom Igoe
*/
// include the library:
const gpio = require('gpio-components');

// configuration of the encoder:
const rotaryEncoderConfig = {
  // pins:
  pinA: 5,
  pinB: 6,
  // listeners:
  onIncrement: increment,
  onDecrement: decrement
};

function increment() {
  console.log("incremented");
}
function decrement() {
  console.log("decremented");
}
// initialize the encoder:
const encoder = new gpio.RotaryEncoder(rotaryEncoderConfig);
// listen for change:
encoder.watch();