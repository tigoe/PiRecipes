# Pi Recipes

This is a collection of things to do on a Raspberry Pi. It's cobbled together from various projects that I've written for different classes. I decided it would be best to collect them all in one place.

I tend to use the [Pi Zero W](https://www.raspberrypi.org/products/raspberry-pi-zero-w/) as my primary board, and I operate it as a standalone device, with no screen or keyboard. To access it initially, I use either a serial connection or a USB connection. My default OS distribution is [Raspbian Lite](https://www.raspberrypi.org/downloads/raspbian/). I generally use a 16GB or 32GB SD card. Unless noted otherwise, the examples here are all built on that configuration.

## Setting Up A Raspberry Pi Securely

The first thing you should do for any Pi-based project is to configure a secure system. By switching from the default settings (such as username pi) and setting up a firewall, you can reduce the risl that your device will be compromised by external attacks. You can find a detailed tutorial on [configuring a Pi reasonably securely](https://itp.nyu.edu/networks/tutorials/setting-up-a-raspberry-pi/) on the [ITP Networks site](https://itp.nyu.edu/networks). There's also a [longer intro to firewalls](0https://itp.nyu.edu/networks/tutorials/setting-up-a-firewall-on-an-embedded-linux-device/) on that site.

