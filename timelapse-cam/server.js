/*
  Webcam server

  takes a picture once a minute, saves it to /public/img
  Serves the public directory. A script in the index.html
  page fetches a new image periodically from the /latest
  endpoint. 

  In order to make this work you need to install fswebcam, 
  because the node-webcam library uses that as its camera app.
  For more on this, see 
  https://www.raspberrypi.org/documentation/usage/webcams/

  created 19 Jan 2021
  by Tom Igoe
*/

// initiate the camera driver:
const camDriver = require("node-webcam");
const express = require('express');	      // include the express library
var server = express();					          // create a server using express
server.use('/', express.static('public')); // serve static files from /public
server.use(express.json()); 						  // for  application/json
var interval;         // capture interval
// where the images go:
const imageDir = 'public/img/';
var lastImage = '';

// this runs after the server successfully starts:
function serverStart() {
  let port = this.address().port;
  console.log('Server listening on port ' + port);
}

//Default options for fswebcam:
var options = {
  width: 1280,
  height: 720,
  quality: 100,
  // Number of frames to capture. more frames means 
  // longer capture time and higher quality.
  frames: 30,
  delay: 0,          // delay in seconds before shot
  saveShots: true,   // save shots in memory
  output: "jpeg",    // jpeg or png
  // Which camera to use:
  // Webcam.list() lists devices in /dev/video *
  // use false for default:
  device: false,
  // what to return from the image capture: 
  // file location, buffer or base64
  callbackReturn: "location",
  verbose: false,    // logging output
  // this is not an fswebcam option, it's the capture interval
  // for this server:
  interval: 60
};

// callback function for the image capture function:
function getResult(error, data) {
  if (error) {
    console.log(error);
  } else {
    lastImage = data;
  }
}

function takePicture() {
  let timestamp = new Date()    // get current date and time
    .toISOString()        // convert to e.g. 2012-11-04T14:51:06.157Z
    .replace(/T/, '_')    // replace T with _
    .replace(/\..+/, ''); // delete all after seconds integer
  let imagePath = imageDir + 'image' + timestamp;
  // capture image (file type extension added automatically):
  cam.capture(imagePath, getResult);
}

// get  latest image name:
function getLatest(request, response) {
  response.end(lastImage.substring(6));
}

// get the list of camera devices:
// TODO: get descriptions on these from the OS
function getCameraList(request, response) {
  function getList(cameras) {
    response.end(JSON.stringify(cameras));
    response.end('here is a list');
  }

  cam.list(getList);
}

// post request handler for 
// a new set of parameters for fswebcam:
function postParams(request, response) {
  // iterate over the body JSON
  for (item in request.body) {
    // if options has a property by the same name:
    if (options.hasOwnProperty(item)) {
      // update the options property:
      options[item] = request.body[item];
    }
    if (item === 'interval') {
      // set capture interval:
      clearInterval(interval);  // have to clear it first
      interval = setInterval(takePicture, request.body[item] * 1000);
    }
  }
  // return the new options after setting them:
  response.json(options);
}

// get request handler for the fswebcam options:
function getParams(request, response) {
  response.json(options);
}

// Create camera instance:
var cam = camDriver.create(options);
// set capture interval:
interval = setInterval(takePicture, options.interval * 1000);

// start the server:
server.listen(8080, serverStart);  
// server routes:
server.get('/latest', getLatest);
server.get('/cameras', getCameraList);
server.post('/params', postParams);
server.get('/params', getParams);