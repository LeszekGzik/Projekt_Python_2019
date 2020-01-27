from websocket_server import WebsocketServer
from tetris import Tetris
from threading import Timer

tetris = [""]
command = [""]
first_run = True

# Called for every client connecting (after handshake)
def new_client(client, server):
	global tetris, command, first_run
	id = client['id']
	print("New client(%d) connected" % id)
	tetris.insert(id, Tetris())
	command.insert(id, "")
	print("Game created")
	#tetris[id].first_run = True

#runs one update cycle of the game and sends current state to client
def update(client):
	global tetris, command, first_run
	id = client['id']
	#print("Updating game (%d)" % id)
	if(not command[id] == "stop"):
		coord_matrix = tetris[id].update("down")
		send_block(client, coord_matrix)	
		if(command[id] != ""):
			coord_matrix = tetris[id].update(command[id])
			send_block(client, coord_matrix)
			command[id] = ""
		if(tetris[id].end):
			tetris[id].first_run = True
			server.send_message(client,"End")
		else:
			Timer(0.5, update, args = [client]).start()
	
#sends the current block coords to websocket
def send_block(client, coord_matrix):
	global tetris
	id = client['id']
	X = "X:"
	Y = "Y:"
	for x in coord_matrix[0]:
		X += str(x) + ", "
	server.send_message(client, X)
	for y in coord_matrix[1]:
		Y += str(y) + ", "
	server.send_message(client, Y)
	if(tetris[id].removed_rows >= ""):
		server.send_message(client, "R:"+tetris[id].removed_rows)
		tetris[client['id']].removed_rows = ""
	
# Called for every client disconnecting
def client_left(client, server):
	global tetris, command
	id = client['id']
	print("Client(%d) disconnected" % id)
	command[id] = "stop"

# Called when a client sends a message
def message_received(client, server, message):
	global tetris, command, first_run
	id = client['id']
	print("Client(%d) said: %s" % (id, message))
	command[id] = message
	if(command[id] == "new"):
		tetris[id].new_game()
		command[id] = ""
		if(tetris[id].first_run):
			tetris[id].first_run = False
			update(client)
	elif(command[id][:5]=="NICK:"):
		command[id] = command[id][5:]
		save_score(client, command[id])
	elif(command[id]=="HS"):
		send_highscores(client)

#Saves the player's score to the highscores.hs file
def save_score(client, nick):
	global tetris
	id = client['id']
	file = open("highscores.hs","a+")
	file.write(nick + ":" + str(tetris[id].score) +"\n")
	file.close();
	
#Sends the top 5 scores from highscores.hs file to the player
def send_highscores(client):
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
		server.send_message(client,"H:"+str(i+1)+") "+max_line)
		content.remove(max_line)
	file.close()
		
#initialize everything
PORT=9001
server = WebsocketServer(PORT)
server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(message_received)
print("WebsocketServer started, listening on port 9001")
server.run_forever()