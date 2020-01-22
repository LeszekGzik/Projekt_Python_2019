var ws;

var canvas;
var ctx;
var scoreText;
var score;
var inputField;

var leftDirection = false;
var rightDirection = true;
var upDirection = false;
var downDirection = false;
var inGame = true; 

var redImg;
var blueImg;
var greenImg;
var orangeImg;
var purpleImg;

const partSize=20;
const startX=60; //starting pos. for test
const startY=60;

const C_HEIGHT = 400;	//20points
const C_WIDTH = 200;  //10 points
const DELAY = 140;
//variables for tests
var testArrayX =[1,1,1,1];
var testArrayY =[1,2,3,4];
var gameWindow;
var testImg;
var moved =false;

const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;
const P_KEY = 80;

class Point{
	
	constructor(x,y,img){
		this.img = img;
		this.x = x;
		this.y = y;
	}
	
	setX(x){
		this.x=x;
	}
	
	setY(y){ 
		this.y=y;
	}
	
	setImg(img){
		this.img = img;
	}
	
	getX(){
		return this.x;
	}
	
	getY(){
		return this.y;
	}
	
	getImg(){
		return this.img;
	}
	
	
}

class Block{
	
	constructor(){
		//seting random color
		var img= new Image();
		var color = Math.floor((Math.random() * 5) + 1);
		
		switch(color){
		case 1:
			img = redImg;
			break;	
		case 2:
			img = blueImg;
			break;
		case 3:
			img = greenImg;
			break;
		case 4:
			img = orangeImg;
			break;
		default:
			img = purpleImg;
			break;
		}
		
		this.points= new Array();
		//this.points= [];
		//TODO in for change default value of creating points to coordinates out of display area(np. -1)
		for(var i=0;i<4;i++){
			this.points.push(new Point(i*partSize, i*partSize, img));
			
		}
		
	}
	
	setPosition(arrayX, arrayY){
		for(var i=0;i<4;i++){
			this.points[i].setX(arrayX[i]*partSize);
			this.points[i].setY(arrayY[i]*partSize);
			//ctx.fillText("Blocks"+this.points[i].getX()+" "+this.points[i].getY(), 50, 50+i*20);
		}
	}

	getPoints(){
		return this.points;
	}
}

class Window{

	constructor(){
		this.allPoints = new Array();
		this.pointImage = new Image();
		this.currentBlock = new Block();
	}
	
	addBlock(newBlock){
		this.currentBlock = newBlock;
		for(var i=0;i<4;i++){
			this.allPoints.push(newBlock.getPoints()[i]);
		}
	}
	/*
	 * Usuwanie wiersza o danym indexie
	 */
	removeRow(index){
		for(var i=0; i < this.allPoints.length; i++){
			if(this.allPoints[i].getY() == index*partSize){
				this.allPoints.splice(i,1);
				i = 0;
			}
		}
		
		for(var i=0; i < this.allPoints.length; i++){
			if(this.allPoints[i].getY() < index*partSize){
				this.allPoints[i].setY(this.allPoints[i].getY() + partSize)
			}
		}
		
	}
	
	move(arrayX,arrayY){
		this.currentBlock.setPosition(arrayX,arrayY);
	}
	
	//move block by(not TO) x and y
	moveTestDisplay(x,y){
		for(var i=0;i<4;i++){
			testArrayX[i] = testArrayX[i]+x;
			testArrayY[i] = testArrayY[i]+y;
		}
		this.currentBlock.setPosition(testArrayX, testArrayY);
		//ctx.fillText('Game over', 100,300);
		
		score=score+1;
		document.getElementById("score").innerHTML = "YOUR SCORE: "+score;
		//scoreText="Score: "+score;
	}
	
	getImage(){
		return this.pointImage;
	}
	
	getBlock(){
		return this.currentBlock;
	}
	
	getAllPoints(){
		return this.allPoints;
	}
	
	clearAllPoints(){
		this.allPoints = [];
	}
}

function initWebSocket() {
	
  // Connect to Web Socket
  ws = new WebSocket("ws://localhost:9001/");

  // Set event handlers.
  ws.onopen = function() {
	
  };
  
  ws.onmessage = function(e) {
	message = e.data;
	//koordynaty X klocka
	if(message.charAt(0) == 'X') {
		message = message.substring(message.indexOf(":") + 1);
		var i;
		for(i = 0; i<4; i++) {
			testArrayX[i] = parseInt(message.substring(0, message.indexOf(",")));
			message = message.substring(message.indexOf(",") + 1);
		}
	}
	//koordynaty Y klocka
	else if(message.charAt(0)== 'Y') {
		message = message.substring(message.indexOf(":") + 1);
		var i;
		for(i = 0; i<4; i++) {
			testArrayY[i] = parseInt(message.substring(0, message.indexOf(",")));
			message = message.substring(message.indexOf(",") + 1);
		}
		
		for(i = 0; i<4; i++) {
			if((testArrayY[0] == 0)&&(testArrayY[0] < gameWindow.getBlock().points[0].getY())) {
				gameWindow.addBlock(new Block());
				break;
			}
		}
		gameWindow.move(testArrayX,testArrayY);
	}
	//usuń wiersz
	else if(message.charAt(0)== 'R') {
		message = message.substring(message.indexOf(":") + 1);
		index = message.indexOf(",");
		while(index > 0) {
			rowID = parseInt(message.substring(0,index));
			gameWindow.removeRow(rowID);
			score += 100;
			message = message.substring(index + 1);
			index = message.indexOf(",");
		}	
		document.getElementById("score").innerHTML = "YOUR SCORE: "+score;
	}
	
	//koniec gry
	else if(message == "End") {
		gameOver();
	}
  };
  
  ws.onclose = function() {
	alert("onclose");
  };

  ws.onerror = function(e) {
	alert("onerror");
	console.log(e)
  };
}

function init() {
	initWebSocket();
	score=0;
	document.getElementById("score").innerHTML = "YOUR SCORE: "+score;
	
	//document.getElementById("inputField")	
	
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
     
    ctx.fillStyle = 'white'; 
    ctx.textBaseline = 'middle'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'normal bold 18px serif';
    
    
    //////////init images
    redImg = new Image();
    redImg.src = "red2.png"
    greenImg = new Image();
    greenImg.src = "green.png"
    blueImg = new Image();
    blueImg.src = "blue.png"
    orangeImg = new Image();
    orangeImg.src = "orange.png"
    purpleImg = new Image();
    purpleImg.src = "purple.png"
    //////////
    
    
    gameWindow = new Window();
    //gameWindow.loadImages();
    gameWindow.addBlock(new Block());

    gameWindow.getBlock().setPosition(testArrayX,testArrayY);
    setTimeout("gameCycle()", DELAY);

}

onkeyup = function(e) {  
    var key = e.keyCode;
	if (key == LEFT_KEY) {
		ws.send("left");
	}

	if (key == RIGHT_KEY) {    
		ws.send("right");
	}	

	if (key == UP_KEY) {
		ws.send("up");
	}	

	if (key == DOWN_KEY) {
		ws.send("down");
	}
	
	if (key == P_KEY) {
		ws.send("pause");
	}
};

function doDrawing() {
    
	
    ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);

    if(inGame){
    	
    	for(var i=0; i < gameWindow.getAllPoints().length; i++){
    		//ctx.drawImage(gameWindow.getImage(), gameWindow.getAllPoints()[i].getX(), gameWindow.getAllPoints()[i].getY(),20,20);//(img,x,y,width,height)
    		ctx.drawImage(gameWindow.getAllPoints()[i].getImg(), gameWindow.getAllPoints()[i].getX(), gameWindow.getAllPoints()[i].getY(),20,20);//(img,x,y,width,height)
        	
    		//ctx.darwImage(pointImg,window.getAllPoints()[i].getX(), window.getAllPoints()[i].getY())
    		
    	}
    }else{
    	gameOver();
    }   
    //ctx.fillText("Game over", 100, 150);
}

function gameOver() {
    
	inGame=false;
	
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'normal bold 18px serif';
    
    ctx.fillText('Game over', C_WIDTH/2, C_HEIGHT/2);
    
    //nick input prompt
    var nick = prompt("Enter your nick", "NoName");

    if (nick != null) {
      //document.getElementById("input").innerHTML =
      //"Hello " + nick + "! How are you today?";
      //newGame();
      //init();//jesli cos innego to nie dziala
	  ws.send("NICK:"+nick);
    } 
    
}
 
function newGame(){
	score=0;
	
	if(inGame==true){
		//gameWindow.getAllPoints().clear();
		gameWindow.clearAllPoints();
		gameWindow.addBlock(new Block());
		gameWindow.getBlock().setPosition(testArrayX,testArrayY);
		//TODO send info about new game
	}else{
		gameWindow.clearAllPoints();
		gameWindow.addBlock(new Block());
		gameWindow.getBlock().setPosition(testArrayX,testArrayY);
		
		inGame = true;
    	document.getElementById("input").innerHTML="";
	}
	ws.send("new");
    //init();
}
 
function gameCycle() {
	
    if (inGame) {
        doDrawing();
    }
    setTimeout("gameCycle()", DELAY);
}
