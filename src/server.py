from websocket_server import WebsocketServer
from tetris import Tetris
from threading import Timer

tetris = 0
command = ""
first_run = True

# Called for every client connecting (after handshake)
def new_client(client, server):
	global tetris, first_run
	print("New client connected")
	tetris = Tetris()
	print("Game created")
	first_run = True

#runs one update cycle of the game and sends current state to client
def update():
	global tetris, command, first_run
	if(not command == "stop"):
		coord_matrix = tetris.update("down")
		send_block(coord_matrix)	
		if(command != ""):
			coord_matrix = tetris.update(command)
			send_block(coord_matrix)
			command = ""
		if(tetris.end):
			first_run = True
			server.send_message_to_all("End")
		else:
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
	if(tetris.removed_rows >= ""):
		server.send_message_to_all("R:"+tetris.removed_rows)
		tetris.removed_rows = ""
	
# Called for every client disconnecting
def client_left(client, server):
	global tetris, command
	print("Client(%d) disconnected" % client['id'])
	command = "stop"

# Called when a client sends a message
def message_received(client, server, message):
	global tetris, command, first_run
	print("Client said: %s" % (message))
	command = message
	if(command == "new"):
		tetris.new_game()
		command = ""
		if(first_run):
			first_run = False
			update()
	elif(command[:5]=="NICK:"):
		command = command[5:]
		save_score(command)
	elif(command=="HS"):
		send_highscores()

#Saves the player's score to the highscores.hs file
def save_score(nick):
	global tetris
	file = open("highscores.hs","a+")
	file.write(nick + ":" + str(tetris.score) +"\n")
	file.close();
	
#Sends the top 5 scores from highscores.hs file to the player
def send_highscores():
	with open("highscores.hs","r") as file:
		content = file.readlines()
	content = [x.strip() for x in content]
	for i in range(5):
		max = -1
		max_line = ""
		for line in content:
			score = int(line[line.find(':')+1:])
			if(score > max):
				max = score
				max_line = line
		server.send_message_to_all("H:"+str(i+1)+") "+max_line)
		content.remove(max_line)
	file.close()
		
#initialize everything
PORT=9001
server = WebsocketServer(PORT)
server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(message_received)
server.run_forever()