// Hold the ml5.js FaceMesh model
// We need to use FaceMesh > Facial Landmark Detection feature.
let faceMesh;
let video; // The video to store the webcam video.
let faces = []; // This one will store the markers across the faces.
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };
let playerSprite;
let mirrorSprite;
let schoolbellFont;
let tooltip;
let cameraMode;
let keyboardMode;
let gameMode = 0; // default (camera)
let helpBtn;
let aboutBtn;
let paper;

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
  playerSprite = loadImage('assets/character.png');
  mirrorSprite = loadImage('assets/mirror.png');


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
  faceMesh = ml5.faceMesh(options, modelLoaded);
  faceMesh.detectStart(video, gotFaces);

  // Create the game
  game = new Game();
}

function draw() {
  game.show();
}

function modelLoaded() {
  console.log("FaceMesh Model is loaded and ready!");
}

// Handle window resizing event so our game won't be seen weird.
// Ref: https://p5js.org/reference/p5/windowResized/
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
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
      return true;
    }
    else {
      console.log('smile X');
      return false;
    }  
  }
  
  return false;
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