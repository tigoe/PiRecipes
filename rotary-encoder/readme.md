# Rotary Encoder Input using GPIO 

This example shows how to read a rotary encoder attached to two digital inputs. It uses  the [node.js onoff-rotary library](https://www.npmjs.com/package/onoff-rotary). This example was tested on a Raspberry Pi Zero.

## The Circuit

The center terminal of a rotary encoder is attached to the Pi Zero's ground pin (fifteenth pin down from the SD card holder on the right). The two outer terminals of the encoder are attached to GPIO pins 5 and 6 (pins 15 and 16 down from the SD card on the right). The circuit is shown in Figure 1 below.

This configuration works for the pushbutton because pins 5 and 6 are configured with a pullup resistor on the Pi by default. To see the default states of the GPIO pins, see Table 6-31 on pages 102 and 103 of the [BCM2835 ARM Peripherals datasheet](http://www.farnell.com/datasheets/1521578.pdf). The onoff library documentation has [more detail on pullups and pulldowns](https://www.npmjs.com/package/onoff#configuring-pullup-and-pulldown-resistors).


![Figure 1. Rotary encoder connected to Raspberry Pi's GPIO pins](pi-rotary-encoder_bb.png)

_Figure 1. Rotary encoder connected to Raspberry Pi's GPIO pins. The encoder connects to GPIO 5 and 5 and ground._

## Installing the Library

Type the following on the command line of your Pi to install the library:

````
$ npm install onoff-rotary
````

Alternatively, if you clone this repository, you'll get the whole directory, and can install mcp-spi-adc using the package.json file like so:

````
$ npm install
````

## Running the Script

Once you have the library installed, you're ready to go. See the index.js file in this repo for detailed notes. Note that you will have to run this script using sudo on the Pi. So, to test the script, type:

````
$ sudo node index.js
````
And you should get some encoder readings: 1 for one direction, and -1 for the other, depending on how you wired the pins.
