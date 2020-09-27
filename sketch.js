var PLAY = 1;
var END = 0;
var gameState = PLAY;

var backgroundImage;

var trex, trex_running, trex_collided,hat,hatImage;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  
  //loading sounds
  jumpSound = loadSound("jump.mp3"); 
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  
  //loading images
  backgroundImage = loadImage("mountain.jpg");
  
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  hatImage = loadImage("hat.png");
  
  groundImage = loadImage("ground2.png");
    
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
}

function setup() {
  //making the game fit all screen sizes
  createCanvas(windowWidth,windowHeight);
  
  //creating invisible ground
  invisibleGround = createSprite(width/2,height+5, width,125);  
  invisibleGround.visible = false;
    
  //creating a trex and a hat
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.6;
  
  hat = createSprite(60,height-125,20,30);
  hat.addImage("warm",hatImage);
  hat.scale = 0.2;
    
  //creating the ground
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width /2;
  
  //creating the game Over text
  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);
  
  //creatin the restart button
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  //scaling the gameOver and restart sprites
  gameOver.scale = 0.7;
  restart.scale = 0.6;
    
  //create Obstacle and Cloud Groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  //settin collider size for trex and the hat
  trex.setCollider('circle',0,0,50)
  hat.setCollider('rectangle',0,-30);
  
  score = 0;
  
}

function draw() {
  
  //setting the background Image
  background(backgroundImage);
  
  //displaying score
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  
  if(gameState === PLAY){

    //making the gameOver and restart sprites invisible
    gameOver.visible = false;
    restart.visible = false;
    
    //making the ground move faster
    ground.velocityX = -(6 + 3*score/100);
    
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    //adding the checkpoint sound
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    //making the ground move continuously
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when space is pressed or when it is touched
    if((touches.length>0||keyDown("SPACE"))&&trex.y>=height-
    180) {   
      jumpSound.play( )
      trex.velocityY = -10;
       touches = [];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    hat.velocityY = trex.velocityY; 
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    //changing the gameState to END
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      //making the gameOver and restart visible
      gameOver.visible = true;
      restart.visible = true;
     
      //changing the trex animation
      trex.changeAnimation("collided", trex_collided);  
     
      //changing the velocity to 0
      ground.velocityX = 0;
      trex.velocityY = 0;
      hat.velocityY = 0;
       
    //setting lifetime
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     //setting velocity
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
     
     //restarting the game
     if(touches.length>0 || keyDown("SPACE")) 
     {      
      reset();
      touches = []
     }
   }
  
  //stop trex from falling down
  trex.collide(invisibleGround);
  hat.collide(trex);
  
  //drawing all the sprites
  drawSprites();
}

function reset(){
  //changing the gameState
  gameState = PLAY;
  //making the gameOver and restart invisible again
  gameOver.visible = false;
  restart.visible = false; 
  //destroying the objects and clouds
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach(); 
  //changing the animation
  trex.changeAnimation("running",trex_running); 
  //setting score to 0
  score = 0;
}


function spawnObstacles(){
 if(frameCount % 60 === 0) {
    //creating obstacle sprite
    var obstacle = createSprite(600,height-75,20,30);
    //making the obstacle collide with the ground
    obstacle.collide(invisibleGround);
    //changing the size of the collider
    obstacle.setCollider('circle',0,0,130)
  
    //making the obstacle go faster 
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generating random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.4     ;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    //creating cloud sprites
    var cloud = createSprite(width+20,height-300,40,10);
    //making the clouds appear at random locations
    cloud.y = Math.round(random(100,220));
    //adding image
    cloud.addImage(cloudImage);
    //scaling the cloud
    cloud.scale = 0.5;
    //adding the velocity
    cloud.velocityX = -3;
    
    //assigning lifetime to the cloud
    cloud.lifetime = 300;
    
        
    //adjusting the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //add each cloud to the cloudsGroup
    cloudsGroup.add(cloud);
  }
}

