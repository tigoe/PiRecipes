function setup() {
  // get the inputs, give them all a listener:
 let inputs = document.getElementsByTagName('input');
for (i of inputs) {
  i.addEventListener('change', updateValue);
}
// get the list of cameras:
// fetchData('cameras', addCameras);
  // call for a new image every 5 seconds:
 // setInterval(fetchData('latest', getImage), 5000);
}

function updateValue(event) {
  let thisSpan = document.getElementById(event.target.name);
  thisSpan.innerHTML = event.target.value;
}

function fetchData(path, callback) {
  let params = {
    headers: {
      'accept': 'application/text'
    }
  }

  // make the HTTP/S call:
  fetch(document.URL + path, params)
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
  // iterate over the list of camera names:
  for (var i = 0; i < data.length; i++) {
    // add this camera name to the select object:
    var option = document.createElement("option");
    option.text = data[i];
    camSelector.add(option);
  }
}

window.addEventListener('DOMContentLoaded', setup);