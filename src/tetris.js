/** JavaScript example
 * 
 */

var canvas;
var ctx;

var head;
var apple;
var ball;

var dots;
var apple_x;
var apple_y;

var leftDirection = false;
var rightDirection = true;
var upDirection = false;
var downDirection = false;
var inGame = true;    

//const DOT_SIZE = 10;
//const ALL_DOTS = 900;
//const MAX_RAND = 29;
//const DELAY = 140;
//const C_HEIGHT = 300;
//const C_WIDTH = 300;    

const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;

const partSize=20;
const startX=60; //starting pos. for test
const startY=60;
//var x = new Array(ALL_DOTS);
//var y = new Array(ALL_DOTS);


const C_HEIGHT = 400;	//20points
const C_WIDTH = 200;  //10 points

class Point{
	
	constructor(){
		this.x=100;
		this.y=200;
	}
	
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
//		this.x = new Array(4);
//		this.y = new Array(4);
		this.points= new Array();
		for(var i=0;i<4;i++)
			points.push(new Point());
		
		//this.partSize=20;
	}
	
	constructor(arrayX,arrayY){
//		this.x = new Array(4);
//		this.y = new Array(4);
		this.points= new Array();
		for(var i=0;i<4;i++)
			points.push(new Point(arrayX[i]*partSize, arrayY[i]*partSize));

	}
	
	setPosition(arrayX, arrayY){
		for(i=0;i<4;i++){
			x[i]=arrayX[i]*partSize;
			y[i]=arrayY[i]*partSize;
		}
	}

	getPoints(){
		return this.points;
	}
	
}


/*
 * Game window
 */
class Window{
	
//	var x
//	var y;
//	var pole;
	
	constructor(){
		this.allPoints = new Array();
		this.pointIamge = new Image();
		this.currentBlock = new Block();
		//this.y = new Array(ALL_DOTS);
//		this.C_HEIGHT = 400;	//20points
//		this.C_WIDTH = 200;  //10 points
	}
	  
	loadImages() {

		this.pointImage.src = 'red2.png';
		this.pointImage.width = partSize;
		this.pointImage.height = partSize;
	}
	
	addBlock(newBlock){
		this.currentBlock = newBlock;
		for(var i=0;i<4;i++){
			this.allPoints.append(newBlock.getPoints[i]);
		}
	}
	/*
	 * Usuwanie wiersza o danym indexie
	 */
	removeRow(index){
		for(var i=0; i<allPoints.size(); i++){
			if(allPoints[i].getY() == index*partSize){
				allPoints.splice(i,1);
			}
		}
		
		for(var i=0; i<allPoints.size(); i++){
			if(allPoints[i].getY() > index*partSize){
				allPoints[i].setY(allPoints[i].getY() - partSize)
			}
		}
		
	}
	
	move(arrayX,arrayY){
		this.currentBlock.setPosition(arrayX,arrayY);
	}
	
	getImage(){
		return this.pointImage;
	}
	
	getBlock(){
		return this.currentBlock;
	}
	
	getAllPoints(){
		return allPoints;
	}
	
}

function init() {
    
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'red';
    ctx.textBaseline = 'middle'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'normal bold 18px serif';
    
    ctx.fillText('Game over', C_WIDTH/2, C_HEIGHT/2);
    
    let alertText="HALO";
    alert(alertText);
    gameOver();
    
//    testImg = new Image()
//    testImg.src = 'C:\Users\Michał\TrylogiaD\Tetrisred2.png';
//    testImg.width = 40;
//    testImg.height = 40;
    
    //ctx.drawImage(testImg, 100, 100);
    
//    gameWindow = new Window();
//    gameWindow.loadImages();
//    gameWindow.addBlock(new Block())
//    
//    setTimeout("gameCycle()", DELAY);

}    
    

function doDrawing(window) {
    
	
    ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);
    
    if(inGame){
    	
    	for(var i=0; i < window.getAllPoints().size(); i++){
        	ctx.darwImage(pointImg,window.getAllPoints()[i].getX(), window.getAllPoints()[i].getY())
        }
    }else{
    	gameOver();
    }   
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

        
        doDrawing();
        setTimeout("gameCycle()", DELAY);
    }
}

onkeydown = function(e) {
    
    var key = e.keyCode;
    
    if ((key == LEFT_KEY) && (!rightDirection)) {
        
        leftDirection = true;
        upDirection = false;
        downDirection = false;
    }

    if ((key == RIGHT_KEY) && (!leftDirection)) {
        
        rightDirection = true;
        upDirection = false;
        downDirection = false;
    }

    if ((key == UP_KEY) && (!downDirection)) {
        
        upDirection = true;
        rightDirection = false;
        leftDirection = false;
    }

    if ((key == DOWN_KEY) && (!upDirection)) {
        
        downDirection = true;
        rightDirection = false;
        leftDirection = false;
    }        
};    










