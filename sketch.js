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


  // Font is loaded via CSS in index.html
  // Set the font name for use with textFont()
  schoolbellFont = 'Schoolbell';

  // Loading images
  tooltip = loadImage('assets/tooltip.png');
  cameraMode = loadImage('assets/camera.png');
  keyboardMode = loadImage('assets/keyboard.png');
}

function setup() {
  console.log('Global Game Jam 2026 project');

  createCanvas(windowWidth, windowHeight);

  // Set the Schoolbell font
  textFont(schoolbellFont);

  // Create the game
  game = new Game();
  // Create the gameplay window
  // createCanvas(windowWidth, windowHeight);
  // Build the Video object, preparing for the transition screen(s).

  // *** CAUTION: It will trigger the inline popup to ask for permission from the camera.
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // c.f. If you want to start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);
  // If you don't 'draw' a video, it won't display the webcam video on the screen so FYI.
}

function draw() {
  game.show();

  game.stage = 1;
  game.started = true;
  game.play = new Stage();




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
  // And let's add something here...
}

function detectsmile() {

  if (faces.length > 0) {
    let face = faces[0];

    let leftCorner = face.keypoints[61];
    let rightCorner = face.keypoints[291];
    
    let topLip = face.keypoints[13];
    let bottomLip = face.keypoints[14];

    // 1. Calculate Mouth Width
    let mouthWidth = dist(leftCorner.x, leftCorner.y, rightCorner.x, rightCorner.y);
    
    // 2. Calculate Face Width (to normalize across distances)
  
    let leftCheek = face.keypoints[234];
    let rightCheek = face.keypoints[454];
    let faceWidth = dist(leftCheek.x, leftCheek.y, rightCheek.x, rightCheek.y);

    if (mouthWidth / faceWidth > 0.45) { // Adjust based on testing
      return true;
    }
    else {
      return false;
   
  }  
  }
}
