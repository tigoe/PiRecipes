/*
  Pushbutton and LED
  Uses pre-ES6 function notation to make the listeners
  clearer for beginners.

  created 5 Apr 2021
  by Tom Igoe
*/
// include the library:
const gpio = require('gpio-components');
// how many times the button has changed:
let changes = 0;

const buttonConfig = {
  pin: 5,             // button pin number
  switchOptions: {
    activeLow: true,  // assumes you're using internal pullups
    edge: 'both',     // when to call onPress
    debounceTimeout: 5  // debounce delay, in ms
  },
  onPress: buttonChange // change handler
};


function buttonChange() {
  // button press is on odd changes, 
  // button release is on even changes:
if (changes % 2 === 0) {
  console.log('release');
} else {
  console.log('press');
  led.toggle();
}
// increment change count:
  changes++;
}

// init the button and LED:
const pushbutton = new gpio.Switch(buttonConfig);
const led = new gpio.LED({pin: 17});
// listen for change:
pushbutton.watch();