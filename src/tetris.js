/**
 * http://usejsdoc.org/
 */

var canvas;
var ctx;
var scoreText;
var score;

var leftDirection = false;
var rightDirection = true;
var upDirection = false;
var downDirection = false;
var inGame = true; 

const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;

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
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


class Point{
	
	constructor(x,y){
		this.x=x;
		this.y=y;
	}
	
	setX(x){
		this.x=x;
	}
	
	setY(y){ 
		this.y=y;
	}
	
	getX(){
		return this.x;
	}
	
	getY(){
		return this.y;
	}
}

class Block{
	
	constructor(){
		this.points= new Array();
		//this.points= [];
		for(var i=0;i<4;i++){
			this.points.push(new Point(i*partSize, i*partSize));
		}
		
	}
	
	setPosition(arrayX, arrayY){
		for(var i=0;i<4;i++){
			this.points[i].setX(arrayX[i]*partSize);
			this.points[i].setY(arrayY[i]*partSize);
			ctx.fillText("Blocks"+this.points[i].getX()+" "+this.points[i].getY(), 50, 50+i*20);
		}
		ctx.fillText("Game over", 100, 100);
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
	  
	loadImages() {

		this.pointImage.src = "red2.png";
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
		for(var i=0; i<allPoints.size(); i++){
			if(allPoints[i].getY() == index*partSize){
				this.allPoints.splice(i,1);
			}
		}
		
		for(var i=0; i<allPoints.size(); i++){
			if(allPoints[i].getY() > index*partSize){
				this.allPoints[i].setY(allPoints[i].getY() - partSize)
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
		document.getElementById("score").innerHTML = "Score: "+score;
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
}


function init() {
    
	//scoreText = document.getElementById("score");
	document.getElementById("score").innerHTML = "Score: "+0;
	score=0;
	
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
     
    ctx.fillStyle = 'white'; 
    ctx.textBaseline = 'middle'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'normal bold 18px serif';
    
    testPoint=new Point(100,50);
    
    testImg = new Image()
 
    testImg.src = "red2.png";
//  testImg.onload = function(){
//	  ctx.drawImage(testImg, 0, 0);
//  }
    //ctx.drawImage(testImg,60,60,20,20);//(img,x,y,width,height)
    
    ctx.drawImage(testImg,testPoint.getX(),testPoint.getY(),20,20);//(img,x,y,width,height)
    //ctx.drawImage(testImg,testPoint.getX()+50,testPoint.getY()+50,20,20);//(img,x,y,width,height)
    
    
    
    
    
    
    gameWindow = new Window();
    gameWindow.loadImages();
    gameWindow.addBlock(new Block());

    gameWindow.getBlock().setPosition(testArrayX,testArrayY);
    setTimeout("gameCycle()", DELAY);

//    let alertText="HALO";
//    alert(alertText);
}



function doDrawing() {
    
	
    ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);

    if(inGame){
    	
    	for(var i=0; i < gameWindow.getAllPoints().length; i++){
    		ctx.drawImage(gameWindow.getImage(), gameWindow.getAllPoints()[i].getX(), gameWindow.getAllPoints()[i].getY(),20,20);//(img,x,y,width,height)
        	//ctx.darwImage(pointImg,window.getAllPoints()[i].getX(), window.getAllPoints()[i].getY())
    		
    	}
    }else{
    	gameOver();
    }   
    //ctx.fillText("Game over", 100, 150);
}

function gameOver() {
    
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'normal bold 18px serif';
    
    ctx.fillText('Game over', C_WIDTH/2, C_HEIGHT/2);
}
 


function gameCycle() {
	
    if (inGame) {
    	//ctx.fillText("Game over", 100, 300);
        doDrawing();
        setTimeout("gameCycle()", DELAY);
    }
}
 
/*
 * Called in function of exception below
 */

function send(){
	
}

/*
 * pewnie wolane gameCycle   (nie wiem)
 */
function recive(){
	
}


/*
 * TODO
 * zamienic gameWindow.moveTestDisplay(....);
 * z
 * send(....)
 */
onkeyup = function(e) {
    
    var key = e.keyCode;
    
    if (key == LEFT_KEY) {
    	
        gameWindow.moveTestDisplay(-1,0);
    }

    if (key == RIGHT_KEY) {
        
    	gameWindow.moveTestDisplay(1,0);
    }

    if (key == UP_KEY) {
        
    	gameWindow.moveTestDisplay(0,-1);
    }

    if (key == DOWN_KEY) {
        
    	gameWindow.moveTestDisplay(0,1);
    }        
};    







