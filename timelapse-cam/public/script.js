function setup() {
  // get the inputs, give them all a listener:
  let inputs = document.getElementsByTagName('input');
  for (i of inputs) {
    i.addEventListener('change', updateValue);
    // put the values in the spans:
    let thisSpan = document.getElementById(i.name);
    if (thisSpan) {
      thisSpan.innerHTML = i.value;
    }
  }
  // get the list of cameras:
  fetchData('cameras', addCameras);
  // call for a new image every 5 seconds:
  setInterval(fetchData('latest', getImage), 5000);
}

function updateValue(event) {
  let thisSpan = document.getElementById(event.target.name);
  thisSpan.innerHTML = event.target.value;
}

function fetchData(path, callback) {
  let requestParams = {
    headers: {
      'accept': 'application/text'
    }
  }

  // make the HTTP/S call:
  fetch(document.URL + path, requestParams)
    .then(response => response.text())  // convert response to text
    .then(data => callback(data))    // get the body of the response
    .catch(error => console.log(error));// if there is an error
}

// function to call when you've got something to display:
function getImage(data) {
  document.getElementById('webcam').src = data;
}

function addCameras(data) {
  let camSelector = document.getElementById('device');
  // get rid of the square brackets:
  let cams = data.slice(1, -1).split(',');
  // iterate over the list of camera names:
  for (var i = 0; i < cams.length; i++) {
    // add this camera name to the select object:
    var option = document.createElement("option");
    // get rid of the quotes:
    option.text = cams[i].slice(1, -1);
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
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(params)
  };

  fetch(document.URL + 'params', requestParams)
    .then(response => response.text())  // convert response to text
    .then(data => console.log(data))    // get the body of the response
    .catch(error => console.log(error));// if there is an error
}

window.addEventListener('DOMContentLoaded', setup);