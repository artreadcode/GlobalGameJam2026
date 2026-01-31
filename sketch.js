// Hold the ml5.js FaceMesh model
// We need to use FaceMesh > Facial Landmark Detection feature.
let faceMesh;
let video; // The video to store the webcam video.
let faces = []; // This one will store the markers across the faces.
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };
let playerSprite;
let mirrorSprite;
let blackScreenSprite;
let schoolbellFont;
let tooltip;
let cameraMode;
let keyboardMode;
let gameMode = 0; // default (camera)
let helpBtn;
let aboutBtn;
let paper;
let barImg;
let returnBtn;

// Stage 1 bedroom parallax layers
let bedroomWall;
let bedroomBack;
let bedroomMid;
let bedroomFloor;
let bedroomFront;

// movement

const pressedKeys = {a: false, d: false };

  function keyPressed() {
    const k = key.toLowerCase();
    if (pressedKeys.hasOwnProperty(k)) pressedKeys[k] = true;
  }

  function keyReleased() {
    const k = key.toLowerCase();
    if (pressedKeys.hasOwnProperty(k)) pressedKeys[k] = false;
  }


function preload() {
  // Load the FaceMesh model
  faceMesh = ml5.faceMesh(options);

  playerSprite = loadImage('assets/character.png');
  mirrorSprite = loadImage('assets/mirror.png');
  blackScreenSprite = loadImage('assets/blackScreen.png');


  // Font is loaded via CSS in index.html
  // Set the font name for use with textFont()
  schoolbellFont = 'Schoolbell';

  // Loading images
  tooltip = loadImage('assets/tooltip.png');
  cameraMode = loadImage('assets/camera.png');
  keyboardMode = loadImage('assets/keyboard.png');

  aboutBtn = loadImage('assets/aboutButton.png');
  helpBtn = loadImage('assets/helpButton.png');

  paper = loadImage('assets/paper.png');
  barImg = loadImage('assets/bar.png');

  returnBtn = loadImage('assets/returnButton.png');

  // Stage 1 bedroom parallax
  bedroomWall = loadImage('assets/Stage_1 bedroom/wall_bedroom.png');
  bedroomBack = loadImage('assets/Stage_1 bedroom/back_bedroom.png');
  bedroomMid = loadImage('assets/Stage_1 bedroom/mid_bedroom.png');
  bedroomFloor = loadImage('assets/Stage_1 bedroom/floor_bedroom.png');
  bedroomFront = loadImage('assets/Stage_1 bedroom/Front_bedroom.png');
}

function setup() {


  console.log('Global Game Jam 2026 project');


  createCanvas(windowWidth, windowHeight);

  // Set the Schoolbell font
  textFont(schoolbellFont);
  
  // Always build the Video object and start FaceMesh detection ONCE.
  // This will trigger the inline popup to ask for permission from the camera.
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();

  faceMesh.detectStart(video, gotFaces);

  // Create the game
  game = new Game();

}

function draw() {
  game.show();
}

function modelLoaded() {
  console.log("FaceMesh Model is loaded and ready!");

  // game.stage = 1;
  // game.started = true;
  // game.play = new Stage();



  if (detectsmile()) {
    //test function
    fill(0, 255, 0);
    textSize(48);
    text("SMILING! 😁", 50, 100);
    console.log("SMILING!");
  }
  
}

// Handle window resizing event so our game won't be seen weird.
// Ref: https://p5js.org/reference/p5/windowResized/
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function gotFaces(results) {
  faces = results;

  console.log('callback function has been called.');
}


function detectSmile() {

  console.log(faces.length);

  if (faces.length != 0 && faces.length > 0 && gameMode === 0) {
    let face = faces[0];

    let leftCorner = face.keypoints[61];
    let rightCorner = face.keypoints[291];
    
    // let topLip = face.keypoints[13];
    // let bottomLip = face.keypoints[14];

    // 1. Calculate Mouth Width
    let mouthWidth = dist(leftCorner.x, leftCorner.y, rightCorner.x, rightCorner.y);
    
    // 2. Calculate Face Width (to normalize across distances)
  
    let leftCheek = face.keypoints[234];
    let rightCheek = face.keypoints[454];
    let faceWidth = dist(leftCheek.x, leftCheek.y, rightCheek.x, rightCheek.y);
    console.log(faceWidth);

    if (mouthWidth / faceWidth > 0.45) { // Adjust based on testing
      console.log('smile detected.');
    if (mouthWidth / faceWidth > 0.45) { // Lowered threshold for easier detection
      return true;
    }
    else {
      console.log('smile X');
      return false;
    }  
  }
  
  return false;
}
}

function mousePressed() {
  if (game && game.play instanceof startScreen) {
    game.play.modeChanging(mouseX, mouseY);
  }
}

function keyPressed() {
  if (game && game.play instanceof startScreen && gameMode === 1) {
    if (key === 'e') {
      game.stage = 5;
    }
  }
}