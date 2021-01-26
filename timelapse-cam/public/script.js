// capture interval:
var interval;

function setup() {
  // get the input values from the server:
  let requestParams = {
    headers: {
      'accept': 'application/json'
    }
  }
  fetch(document.URL + 'params', requestParams)
    .then(response => response.json())  // read response as json
    .then(data => setParams(data))    // get the body of the response
    .catch(error => console.log(error)); // if there is an error

  // get the inputs, give them all a listener:
  var inputs = document.getElementsByTagName('input');
  for (var i of inputs) {
    i.addEventListener('change', updateValue);
  }
  // get the list of cameras:
  fetch(document.URL + 'cameras')
  .then(response => response.text())  // convert response to text
  .then(data => addCameras(data))    // get the body of the response
  .catch(error => console.log(error));// if there is an error

}

// update the span corresponding to the element that changed:
function updateValue(event) {
  let thisSpan = document.getElementById(event.target.name);
  thisSpan.innerHTML = event.target.value;
}

// function to call when you've got something to display:
function getImage() {
  // make the HTTP/S call:
  fetch(document.URL + 'latest')
    .then(response => response.text())  // convert response to text
    .then(data => {
      // set the image src with the result:
      document.getElementById('webcam').src = data;
    })    // get the body of the response
    .catch(error => console.log(error));// if there is an error
  }

// TODO: get camera descriptions instead of /dev/video*
function addCameras(data) {
  // get the camera select element:
  let camSelector = document.getElementById('device');
  // get rid of the square brackets from the data:
  let cams = data.slice(1, -1).split(',');
  // iterate over the list of camera names:
  for (var i = 0; i < cams.length; i++) {
    // add this camera name to the select object:
    var option = document.createElement("option");
    // get rid of the quotes:
    option.text = cams[i].slice(1, -1);
    // add the result to the select item as an option:
    camSelector.add(option);
  }
}

function sendParams() {
  var params = {};
  var inputs = document.getElementById("camForm").elements;
  // Iterate over the form controls
  for (i = 0; i < inputs.length; i++) {
    if (inputs[i].name !== "" && inputs[i].value) {
      if (!isNaN(parseInt(inputs[i].value))) {
        params[inputs[i].name] = parseInt(inputs[i].value);
      } else {
        params[inputs[i].name] = inputs[i].value;
      }
    }
  }
  // make a fetch request:
  let requestParams = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  };

  fetch(document.URL + 'params', requestParams)
    .then(response => response.json())  // read response as json
    .then(data => setParams(data))    // get the body of the response
    .catch(error => console.log(error));// if there is an error
}

// set the values of the UI elements with the 
// values returned from the server:
function setParams(params) {
   // get the inputs and the spans:
  var inputs = document.getElementById("camForm").elements;
  var spans = document.getElementsByClassName("data");
 // for..in gives you the keys of a JSON:
  for (n in params) {
    // look for the form elements with the same name
    // as this key and set the value of them with this value:
    var elts = document.getElementsByName(n);
    for (e of elts) {
      e.value = params[n];
    }
    // do the same with the spans and their innerHTML:
    for (s of spans) {
      if (s.id === n) {
        s.innerHTML = params[n];
      }
    }
  }
    // set interval to call for a new image every 5 seconds:
    clearInterval(interval); 
    interval = setInterval(getImage, params['interval'] * 1000);
    console.log('set parameters');
}

// start things up after DOM loads:
window.addEventListener('DOMContentLoaded', setup);
