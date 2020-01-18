var ws;

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

function onSubmit() {
  var input = document.getElementById("input");
  // You can send message to the Web Socket using ws.send.
  ws.send(input.value);
  output("send: " + input.value);
  input.value = "";
  input.focus();
}

function onCloseClick() {
  ws.close();
}

function output(str) {
  var log = document.getElementById("log");
  var escaped = str.replace(/&/, "&amp;").replace(/</, "&lt;").
	replace(/>/, "&gt;").replace(/"/, "&quot;"); // "
  log.innerHTML = escaped + "<br>" + log.innerHTML;
}
