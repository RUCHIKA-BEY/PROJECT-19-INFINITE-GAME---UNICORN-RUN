var PLAY = 1;
var END = 0;
var gameState = PLAY;
var scenery, sceneryImage;
var horse, horse_running, horse_collided;
var ground,groundImage, invisibleGround;
var carrotsGroup,carrotImage;
var cloudsGroup,cloudImage;
var obstaclesGroup,obstacleImage;
var score=0;
var gameOver, restart;
var jumpSound , checkPointSound, dieSound;
var scorebox,scoreboxImage;

function preload(){
horse_running = 
loadAnimation("1.png","2.png","3.png","4.png","5.png","6.png");
  
horse_collided=loadImage("3.png");
  
groundImage = loadImage("ground2.png");
  
cloudImage = loadImage("CLOUD.png");
  
obstacleImage= loadImage("obstacle.png");
  
carrotImage=loadImage("carrot.png");
  
sceneryImage = loadImage("background.png");
  
scoreboxImage=loadImage("scorebox.png");

gameOverImg = loadImage("gameOver.png");
restartImg = loadImage("restart.png");
  
jumpSound = loadSound("jump.mp3");
dieSound = loadSound("die.mp3");
checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600,300);


  //creating background
  scenery = createSprite(0,0,600,600);
  scenery.addImage(sceneryImage);
  scenery.scale = 2.5;
  
  //to create horse
  horse = createSprite(50,280,20,50);
  horse.addAnimation("running", horse_running);
  horse.addAnimation("collided",horse_collided);
  horse.scale = 0.7;
  
  //to create ground
  ground = createSprite(100,285,1200,10);
  ground.addImage("ground",groundImage);
  ground.velocityX = -(6 + 3*score/100);
  
  //to create gameOver Icon
  gameOver = createSprite(300,150);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  
  //to create restart Icon
  restart = createSprite(300,190);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  
  //to create invisible ground
  invisibleGround = createSprite(200,290,400,10);
  invisibleGround.visible = false;
  
  //to make groups
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  carrotsGroup= new Group();
  
  score = 0;
}

function draw() {
  
  
  
  //to make the collider invisible
  horse.debug = false;
  
  background(255);
  
  
  if (gameState===PLAY){
    
    //to increase the score 
    score = score + Math.round(getFrameRate()/60);
    
    
    ground.velocityX = -(6 + 3*score/100);
    
     // moving ground
    scenery.velocityX = -3 

    if (scenery.x < 0){
      scenery.x = scenery.width/2;
    }
    
    //change the horse animation
    horse.changeAnimation("running",horse_running);
    
    //to make horse jump
    if(keyDown("space") && horse.y >= 159) {
      horse.velocityY = -12;
      jumpSound.play();
    }
  
    //to give gravity
    horse.velocityY = horse.velocityY + 0.8
  
    //to make the ground lenght infinite
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    //to make horse run on invisible ground
    horse.collide(invisibleGround);
    
    //to spawn clouds
    spawnClouds();
    
    //to spawn obstacles
    spawnObstacles();
    
    //to spawn carrots
    spawnCarrots()
    
    //to make following icons invisible during play state
    gameOver.visible = false;
    restart.visible = false;
    
    if(horse.isTouching(carrotsGroup)){
      score=score+10;
    }
    
    //to play checkpoint sound
    if(score>0 && score%100==0){
      checkPointSound.play();
    }
  
    //to change gameState
    if(obstaclesGroup.isTouching(horse)){
        gameState = END;
        dieSound.play();
    }
  }
  else if (gameState === END) {
    
    gameOver.visible = true;
    restart.visible = true;
    
    //set velocity of each game object to 0
    ground.velocityX = 0;
    scenery.velocityX=0;
    horse.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    carrotsGroup.setVelocityXEach(0);
    
    //change the horse animation
    horse.changeAnimation("collided",horse_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    carrotsGroup.setLifetimeEach(-1);
    
    //to reset the game after restart icon is pressed
   if(mousePressedOver(restart))
  {  reset();
  }}
 
  drawSprites();
  text("Score: "+ score,50,50);
  textSize=50;
  
  
}

function reset()
{
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  carrotsGroup.destroyEach();
  score=0;
}

function spawnClouds() {
  //code to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = horse.depth;
    horse.depth = horse.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}
function spawnCarrots(){
  
   //to create the carrots after every 300 frames
  if (frameCount % 300 === 0) {
    var carrot = createSprite(600,120,40,10);
    carrot.y = Math.round(random(160,200));
    carrot.addImage(carrotImage);
    carrot.scale = 0.15 ;
    carrot.velocityX = -3;
    
     //adjust the depth
    carrot.depth = horse.depth;
    horse.depth = horse.depth + 1;
    
     //assign lifetime to the variable
    carrot.lifetime = 200;
    
     //to add each carrot to group
     carrotsGroup.add(carrot);
  }
    
}

function spawnObstacles(){
  
  //to create obstacle after every 60 frames
  if(frameCount % 60 === 0) {
  var obstacle = createSprite(600,270,10,40);
  obstacle.velocityX=-(6+3*score/100);
  obstacle.addImage(obstacleImage);

    
  //assigning scale to the obstacle           
    obstacle.scale = 0.1;
    
  //assingning lifetime to the variable
    obstacle.lifetime = 100;
    
  //adding each obstacle to the group
    obstaclesGroup.add(obstacle);
  
} }



