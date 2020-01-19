from websocket_server import WebsocketServer
from tetris import Tetris
from threading import Timer

tetris = 0
command = ""


# Called for every client connecting (after handshake)
def new_client(client, server):
	server.send_message_to_all("A new client has connected")
	global tetris, command
	print("New client connected")
	tetris = Tetris()
	print("Game created")
	tetris.run()
	print("Game run")
	Timer(0.5, update).start()

def update():
	global tetris, command
	coord_matrix = tetris.update("down")
	send_block(coord_matrix)
		
	if(command != ""):
		coord_matrix = tetris.update(command)
		send_block(coord_matrix)
		command = ""
		
	Timer(0.5, update).start()
	
#sends the current block coords to websocket
def send_block(coord_matrix):
	global tetris
	X = "X:"
	Y = "Y:"
	for x in coord_matrix[0]:
		X += str(x) + ", "
	server.send_message_to_all(X)
	for y in coord_matrix[1]:
		Y += str(y) + ", "
	server.send_message_to_all(Y)
	if(tetris.removed_row >= 0):
		server.send_message_to_all("R:"+str(tetris.removed_row))
		tetris.removed_row = -1
	
	
# Called for every client disconnecting
def client_left(client, server):
	global tetris, command
	print("Client(%d) disconnected" % client['id'])
	command = "stop"

# Called when a client sends a message
def message_received(client, server, message):
	global tetris, command
	print("Client said: %s" % (message))
	command = message

PORT=9001
server = WebsocketServer(PORT)
server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(message_received)
server.run_forever()