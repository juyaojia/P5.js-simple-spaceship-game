var starfield, game_over, ship_caught, space_bounce, ufo

var ballX = 250
var ballY = 250



var speedX = 0
var speedY = 0

var bgY1 = 0
var bgY2 = 1000
var speed = 2

var bounces = 0
var ufos = 0

var ufoX, ufoY

var paddleX = 250
var paddleY = 490
var paddle_speed = 2
var flag = false

var firstTime = true
var mouseFirstPressed = true

var r, g, b, rfactor, gfactor, bfactor

function ufoChangePosition(X, Y){
    do{
      ufoX = random(20+ufo.width,480-ufo.width)
      ufoY = random(20+ufo.height, 300-ufo.height)
    } while(dist(X, Y, ufoX, ufoY) <= ufo.width);
    console.log(ufoX + "   " + ufoY)
}

function preload() {
  starfield = loadImage("media/starfield.png")
  ufo = loadImage("media/ufo.png")
  game_over = loadSound("media/game_over.wav")
  ship_caught = loadSound("media/ship_caught.wav")
  space_bounce = loadSound("media/space_bounce.wav")
}

function setup() {
  createCanvas(500, 500)

  background(0)

  r = random(0, 255)
  g = random(0, 255)
  b = random(0, 255)
  rfactor = 1
  gfactor = 1
  bfactor = 1
  ufoChangePosition()
}

function draw(){
  background(0)
  
  image(starfield,0,bgY1)
  image(starfield,0,bgY2)

  bgY1 += speed
  bgY2 += speed

  if(bgY1 >= 1000){
    bgY1 = bgY2-1000
  }

  if(bgY2 >= 1000){
    bgY2 = bgY1-1000
  }
  
  fill("grey")
  noStroke()
  rectMode(CORNER)
  rect(0,0,20,500)
  rect(480,0,20,500)
  rect(0,0,500,20)

  fill("white")
  text("Bounces: "+bounces+" UFOs: "+ufos, 20, 15)

  r += rfactor
  if (r>255 || r<0) {rfactor*=-1}
  g += gfactor
  if (g>255 || g<0) {gfactor*=-1}
  b += bfactor
  if (b>255 || b<0) {bfactor*=-1}


  //fill the color and draw the ellipse
  fill(r,g,b)
  ellipse(ballX,ballY,20,20)

  //draw the grey border
  rectMode(CENTER)
  fill(255)
  rect(paddleX,paddleY,100,20)

  //move the ball
  ballX += speedX
  ballY += speedY

  //start the game by pressing the move
  if (mouseIsPressed) {
    flag = true
  }

  //change the speed of the ball only first time the mouse is pressed and do speed validation
  if (mouseIsPressed && mouseFirstPressed){
    while (abs(speedX) < 1 || abs(speedY) < 1 ){
      speedX = random(-4,5)
      speedY = random(-4,5)
    }
    mouseFirstPressed = false
  }


  //player can still move the paddle after losing the game
  if (firstTime == false){
    movePaddle()
  }


  //start the game after user pressed the mouse for once
  if(flag){

    //display the image of the ufo
    imageMode(CENTER)
    image(ufo, ufoX, ufoY)
    imageMode(CORNER)
    
    //move the paddle
    movePaddle()

    //bounce the ball
    if(ballX <= 30 || ballX >=470){
      bounces += 1
      space_bounce.play()
      speedX *= -1
    }

    //detect collison
    var ufoCollision = dist(ballX, ballY, ufoX, ufoY) <= (ufo.width/2 + 10)
    var paddleCollision = (ballX >= paddleX-50) && (ballX <= paddleX+50) && (ballY >= paddleY - 20)


    //change the position of the ufo if ufo and ball collision happen
    if (ufoCollision){
      ufos += 1
      ship_caught.play()
      ufoChangePosition(ufoX, ufoY)
    }


    //bounce the ball
    if(ballY <= 30 || paddleCollision) {

      bounces += 1
      space_bounce.play()

      if (paddleCollision){
        if (speedX > 0){
          speedX += map(abs(ballX - paddleX), 0, 26, -0.5, 0.5)
        }
        else if (speedX <= 0){
          speedX -= map(abs(ballX - paddleX), 0, 26, -0.5, 0.5)
        }
        ballY = paddleY - 20
      }
      speedY *= -1
    }

    //end the game if the ball is not caught by the paddle
    if (ballY >= 510){
      game_over.play()
      firstTime = false
      flag = false
      ballX = 250
      ballY = 250
      speedX = 0
      speedY = 0
      mouseFirstPressed = true
      bounces = 0
      ufos = 0
    }

  }
}

function movePaddle(){
    if (keyIsDown(65)){
      if (paddleX >= 72){   
        paddleX -= paddle_speed
      }
    }

    if(keyIsDown(68)){
      if (paddleX <= 428){
        paddleX += paddle_speed
      }
    }
}



