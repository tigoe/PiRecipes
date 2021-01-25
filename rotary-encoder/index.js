/*
    Rotary encoder example

    created 17 Feb 2019
    by Tom Igoe
*/
// include the library:
const rotaryEncoder = require('onoff-rotary');
// set up the encoder input pins:
const myEncoder = rotaryEncoder(5, 6); 

// listener function:
function readRotation(direction) {
    console.log(direction);
}

// start the event listener:
myEncoder.on('rotation', readRotation);