from websocket_server import WebsocketServer
from tetris import Tetris
from threading import Timer

tetris = 0
command = ""


# Called for every client connecting (after handshake)
def new_client(client, server):
	server.send_message_to_all("A new client has connected")
	global tetris
	print("New client connected")
	tetris = Tetris()
	print("Game created")
	tetris.run()
	print("Game run")
	Timer(0.5, update).start()

def update():
	global tetris
	print("Update")
	tetris.update(command)
	server.send_message_to_all("update")
	Timer(0.5, update).start()
	
# Called for every client disconnecting
def client_left(client, server):
	global tetris
	print("Client(%d) disconnected" % client['id'])
	command = "stop"

# Called when a client sends a message
def message_received(client, server, message):
	global tetris
	print("Client said: %s" % (message))
	command = message

PORT=9001
server = WebsocketServer(PORT)
server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(message_received)
server.run_forever()