from random import randrange
import sys, socket

shapes = [
    [[1, 1], [1, 1]], #O shape
    [[0, 1, 1], [1, 1, 0]], #S shape
    [[1, 0, 0], [1, 1, 1]], #L shape
	[[1, 1, 1], [0, 1, 0]], #T shape
	[[1, 1, 0], [0, 1, 1]], #Z shape
	[[0, 0, 1], [1, 1, 1]],   #J shape
	[[1], [1], [1], [1]] #I shape
]
	
def add_to_board(board, cube, offset):
	offset_x = offset[0]
	offset_y  = offset[1]
	for y, i in enumerate(cube):
		for x, j in enumerate(i):
			board [ y + offset_y - 1 ][ x + offset_x ] += j
	return board

def check_free_space(board, shape, offset):
	offset_x = offset[0]
	offset_y  = offset[1]
	for y, i in enumerate(shape):
		for x, j in enumerate(i):
			try:
				if j and board[ y + offset_y ][ x + offset_x ]:
					return True
			except IndexError:
				return True
	return False

class Tetris(object):
	cols = 10
	rows = 20
	
	def __init__(self):
		self.width = 20*self.cols
		self.height = 20*self.rows
		self.score = 0
		self.removed_rows = ""
		self.end = False
		self.pause = False
		self.first_run = True

		self.board = [[0 for x in range(self.cols)] for y in range(self.rows)]
		self.board += [[ 1 for x in range(10)]]	
		self.create_cube()
    	
	def create_cube(self):
		index = randrange(len(shapes))
		self.cube = shapes[index]
		self.cube_x = int(self.cols / 2 - len(self.cube[0])/2)
		self.cube_y = 0
		
		if check_free_space(self.board, self.cube, (self.cube_x, self.cube_y)):
			self.end = True
                
	def draw_cube(self, matrix, offset):
		offset_x = offset[0]
		offset_y  = offset[1]
		coord_x = []
		coord_y = []
		for y, row in enumerate(matrix):
			for x, val in enumerate(row):
				if val:
					coord_x.append((offset_x+x))
					coord_y.append((offset_y+y))
		coord_matrix = [coord_x, coord_y]
		return coord_matrix
 	
	def rotate_cube(self):
		if not self.end and not self.pause:
			new_cube = [ [ self.cube[y][x] for y in range(len(self.cube)) ]
			for x in range(len(self.cube[0]) - 1, -1, -1) ]
			if not check_free_space(self.board, new_cube, (self.cube_x, self.cube_y)):
				self.cube = new_cube
		                   	
	def slide(self, delta_x):
		if not self.end and not self.pause:
			x = self.cube_x + delta_x
			if x > self.cols - len(self.cube[0]):
				x = self.cols - len(self.cube[0])
			if x < 0:
				x = 0
			if not check_free_space(self.board, self.cube, (x, self.cube_y)):
				self.cube_x = x
	
	def down(self):
		if not self.end and not self.pause:
			self.cube_y = self.cube_y + 1
			if check_free_space(self.board, self.cube, (self.cube_x, self.cube_y)):
				self.board = add_to_board(self.board, self.cube, (self.cube_x, self.cube_y))
				self.create_cube()
				while True:
					for i, j in enumerate(self.board[:-1]):
						if 0 not in j:
							del self.board[i]
							self.score += 100
							self.removed_rows += str(i) + ","
							self.board = [[0 for j in range(self.cols)]] + self.board
							break
					else:
						break

	def new_game(self):
		self.score = 0
		self.removed_rows = ""
		self.board = [[0 for x in range(self.cols)] for y in range(self.rows)]
		self.board += [[ 1 for x in range(10)]]
		self.create_cube()
		self.end = False
		self.pause = False
	
	def update(self,command):
		if not self.end:
			if command == "pause":
				self.pause = not self.pause
			if not self.pause:
				if command == "left":
					self.slide(-1)
				if command == "right":
					self.slide(+1)
				if command == "down":
					self.down()
				if command == "up":
					self.rotate_cube() 

		coord_matrix = self.draw_cube(self.cube, (self.cube_x, self.cube_y))
		return coord_matrix
	
	def run(self):
		self.score = 0	
		self.removed_rows = ""
		self.end = False