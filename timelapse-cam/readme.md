# A Timelapse Webcam Application

This application uses node.js and [fswebcam](https://www.raspberrypi.org/documentation/usage/webcams/) to create a timelapse cam. You can use it with a Pi camera, or with a USB webcam. Here is the [man page for fswebcam](https://manpages.ubuntu.com/manpages/bionic/man1/fswebcam.1.html). 

## The Code
The code can be found [in this repository](https://github.com/tigoe/PiRecipes/tree/master/timelapse-webcam).

## Installation
To run this app, you'll need to install the following components on your Pi:
* node.js and npm - the server side JS tools. The latest version doesn't run on the Pi, so I use XXX
* pm2 - I use this to turn the server script into a daemon, keep logs, etc. 
* fswebcam - the cam software. 

The command line installs are as follows:

````sh
$ sudo apt update
$ wget -O - https://raw.githubusercontent.com/sdesalas/node-pi-zero/master/install-node-v11.5.0.sh | bash
$ sudo apt install pm2
$ sudo apt install fswebcam
````
For more on installing node.js, see [this link](https://itp.nyu.edu/networks/setting-up-a-raspberry-pi/#Upgrading_nodejs).

## The Software Components
The components are as follows:

* server.js - the node.js script that runs as the server
  * [express.js](https://expressjs.com/) - the library for making the server
  * [node-webcam](https://www.npmjs.com/package/node-webcam) - the library for controlling fswebcam
* public html directory including:
  * index.html - the HTML interface
  * script.js - the client-side JavaScript
  * styles.css - the client-side CSS file
  * img directory - the directory of images
* [fswebcam](https://www.raspberrypi.org/documentation/usage/webcams/) - the webcam software taking the pictures

## The Server API
The node.js server initializes fswebcam and takes a picture once on a regular interval. It has the following HTTP endpoints:

* GET `/latest` - returns the path to the latest image. 
* GET `/cameras` - returns a list of the cameras available to fswebcam, from the `/dev` directory. 
* POST `/params` - sets the parameters of fswebcam and the intervam between image captures. Expects a JSON body with the available parameters of fswebcam, and an additional interval parameter. Returns the fswebcam parameters and interval.
* GET `/params` - returns the fswebcam parameters and interval. 

## The Client Interface

The client interface shows the latest image and a series of input controls to change the fswebcam settings. Clicking Update Settings updates the server's fswebcam settings. 