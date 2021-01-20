function fetchImg() {
  let params = {
    headers: {    
      'accept': 'application/text'
    }
  }

  // make the HTTP/S call:
  fetch(document.URL + 'latest', params)
    .then(response => response.text())  // convert response to text
    .then(data => getResponse(data))    // get the body of the response
    .catch(error => getResponse(error));// if there is an error
}

// function to call when you've got something to display:
function getResponse(data) {
  document.getElementById('webcam').src = data;
}
// call for a new image every 5 seconds:
setInterval(fetchImg, 5000);