# Pi Recipes

This is a collection of things to do on a Raspberry Pi. It's cobbled together from various projects that I've written for different classes. I decided it would be best to collect them all in one place. Many of these are bare introductions with links to the tutorials I learned from, because there are many good ones (and as many bad ones) already on the web. 

## Hardware Configuration

I tend to use the [Pi Zero W](https://www.raspberrypi.org/products/raspberry-pi-zero-w/) as my primary board, and I operate it as a standalone device, with no screen or keyboard. To access it initially, I use either a serial connection or a USB connection. My default OS distribution is [Raspbian Lite](https://www.raspberrypi.org/downloads/raspbian/). I generally use a 16GB or 32GB SD card. Unless noted otherwise, the examples here are all built on that configuration. The [Pi 3 Model B+](https://www.raspberrypi.org/products/raspberry-pi-3-model-b-plus/) is my go-to for when I need 5GHz WiFi or more processing power.

## The Raspberry Pi Documentation Pages

Before you run off to search for a term + raspberry pi on Google, check out the [Raspberry Pi foundation's documentation pages](https://www.raspberrypi.org/documentation/). They're succinct, clear, and helpful. In particular, their [Introduction to Linux section](https://www.raspberrypi.org/documentation/linux/) is as good as intro as any out there.

## Setting Up A Raspberry Pi Securely

The first thing you should do for any Pi-based project is to configure a secure system. By switching from the default settings (such as username pi) and setting up a firewall, you can reduce the risl that your device will be compromised by external attacks. You can find a detailed tutorial on [configuring a Pi reasonably securely](https://itp.nyu.edu/networks/tutorials/setting-up-a-raspberry-pi/) on the [ITP Networks site](https://itp.nyu.edu/networks). There's also a [longer intro to firewalls](0https://itp.nyu.edu/networks/tutorials/setting-up-a-firewall-on-an-embedded-linux-device/) on that site.

## Recipes

* [Backing Up a Pi Disk](backups.md)
* [Cron Jobs](cronjobs.md)
* [Using VNC for Windowed applications through the command line](VNC.md)
* [Time Lapse Photography](timelapse.md)
  * [Timelapse Webcam](timelapse-cam)


### Physical I/O Recipes
* [Digital Input and Output using the GPIO pins](gpio-input)
* [GPIO Components](gpio-components) includes examples for a rotary encoder, a pushbutton, and an LED using GPIO pins.
* [Connecting an analog-to-digital converter](adc-mcp-3xxx) for analog sensor input
* [Connecting an SSD1306 OLED Display](SSD1306Display) via I2C
* [Connecting a DHTxx Temperature and Humidity Sensor](dht-sensor)

For the physical I/O recipes, the Pi Pinouts shown in Figure 1 are useful. 

![Pi Pinouts](pi_pinouts.png)

_Figure 1. Pi pinouts_