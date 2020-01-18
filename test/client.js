var ws;
const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;

function init() {

  // Connect to Web Socket
  ws = new WebSocket("ws://localhost:9001/");

  // Set event handlers.
  ws.onopen = function() {
	output("onopen");
  };
  
  ws.onmessage = function(e) {
	// e.data contains received string.
	output("onmessage: " + e.data);
  };
  
  ws.onclose = function() {
	output("onclose");
  };

  ws.onerror = function(e) {
	output("onerror");
	console.log(e)
  };

}

onkeyup = function(e) {  
    var key = e.keyCode;
	if (key == LEFT_KEY) {
		output("left");
		ws.send("left");
	}

	if (key == RIGHT_KEY) {    
		output("right");
		ws.send("right");
		
	}	

	if (key == UP_KEY) {
		output("up");
		ws.send("up");
		
	}	

	if (key == DOWN_KEY) {
		output("down");
		ws.send("down");
		
	}
};

/*function onSubmit() {
  var input = document.getElementById("input");
  // You can send message to the Web Socket using ws.send.
  ws.send(input.value);
  output("send: " + input.value);
  input.value = "";
  input.focus();
}

function onCloseClick() {
  ws.close();
}*/

function output(str) {
  var log = document.getElementById("log");
  var escaped = str.replace(/&/, "&amp;").replace(/</, "&lt;").
	replace(/>/, "&gt;").replace(/"/, "&quot;"); // "
  log.innerHTML = escaped + "<br>" + log.innerHTML;
}
