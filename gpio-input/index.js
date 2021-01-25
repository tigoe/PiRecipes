/*
 GPIO input & output

 created 17 Feb 2019
 by Tom Igoe
*/

let Gpio = require('onoff').Gpio; // include onoff library

// set I/O pin as input, listening for both rising and falling changes:
let button = new Gpio(18, 'in', 'both');
// set LED as output:
let led = new Gpio(17, 'out');
// the state of the LED:
let ledState = 0;

// event listener function for button:
function readButton(error, value) {
    if (error) throw error;
    // print the button value:
    console.log(value);
    // if the button is pressed:
    if (value === '1') {
        // toggle the ledState:
        if (ledState === 1) {
            ledState = 0;
        } else {
            ledState = 1;
        }
        // set the LED with ledState:
        led.writeSync(ledState);
    }
}

// start the event listener:
button.watch(readButton);