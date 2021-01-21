/*
  Webcam server

  takes a picture once a minute, saves it to /public/img
  Serves the public directory. A script in the index.html
  page fetches a new image periodically from the /latest
  endpoint. 

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
const imageDir = 'public/img/';
var lastImage = '';

// this runs after the server successfully starts:
function serverStart() {
  let port = this.address().port;
  console.log('Server listening on port ' + port);
}

//Default options
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
  verbose: false    // logging output
};
// Create camera instance:
let cam = camDriver.create(options);

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

function getLatest(request, response) {
  response.end(lastImage.substring(6));
}

function getCameraList(request, response) {

  function getList(cameras) {
    response.end(JSON.stringify(cameras));
    response.end('here is a list');
  }

  cam.list(getList);
}

function readParams(request, response) {
  // iterate over the body JSON
  for (i in request.body) {
    // if options has a property by the same name:
    if (options.hasOwnProperty(i)) {
      // update the options property:
      options[i] = request.body[i];
    }
    if (i === 'interval') {
      // set capture interval:
      clearInterval(interval);  // have to clear it first
      interval = setInterval(takePicture, request.body[i] * 1000);
      console.log(request.body[i] * 1000);
    }
  }
  console.log(options);
  response.end(JSON.stringify(request.body));
}



server.listen(8080, serverStart);  // start the server
server.get('/latest', getLatest);
server.get('/cameras', getCameraList);
server.post('/params', readParams);
// set capture interval:
interval = setInterval(takePicture, 5000);
