// Hold the ml5.js FaceMesh model
// We need to use FaceMesh > Facial Landmark Detection feature.
let faceMesh;
let handPose;
let video; // The video to store the webcam video.
let faces = []; // This one will store the markers across the faces.
let hands = []; // This one will store the markers across the hands.
let faceoptions = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };
let handOptions = { maxHands: 1, flipHorizontal: false };

let playerSprite;
let mirrorSprite;
let doorSprite;
let blackScreenSprite;
let placeholderSprite;

// Player animation sprites
let playerStand;
let playerWalkLeft = [];
let playerWalkRight = [];

let schoolbellFont;

// Tutorial images
let tooltip;
let cameraMode;
let keyboardMode;
let gameMode = 0; // default (camera)
let helpBtn;
let aboutBtn;
let paper;
let longPaper;
let barImg;
let returnBtn;
let closeBtn;
let bgMusic;
let walkSfx;
let heartbeatSound;

let tutorialbarImg;
let tutorialEImg;
let tutorialIImg;

//Help image
let help01;
let help02;
let help03;
let help04;

// Stage 1 bedroom parallax layers
let bedroomBack;
let bedroomMid;
let bedroomFloor;
let bedroomFront;
let bedroomDoor;

// Stage 2 living room parallax layers
let livingroomWall;
let livingroomFloor;
let livingroomMid;
let livingroomFront;
let livingroomDoor;
let schoolWall;
let schoolFloor;
let schoolPoster;
let schoolLockers;
let schoolAssemble;
let toiletBack;
let toiletWall;
let toiletFloor;
let toiletMid;
let toiletDoor;

let header;

let game;

// movement

const pressedKeys = { a: false, d: false };

function keyPressed() {
  const k = key.toLowerCase();
  if (heartbeatGame && heartbeatGame.active && (k === "a" || k === "d")) return;
  if (pressedKeys.hasOwnProperty(k)) pressedKeys[k] = true;

  // Unlock audio on first user interaction (required by browsers)
  if (typeof userStartAudio === "function") {
    userStartAudio();
  }

  if (game && game.play instanceof startScreen && gameMode === 1 && k === "e") {
    game.stage = 1;
  }

  // Test transition effect with 'T' key
  if (game && k === "t") {
    game.testTransition();
  }

  // Heartbeat rhythm game with 'P' key
  if (k === "p") {
    if (!heartbeatGame) {
      heartbeatGame = new HeartbeatGame();
    }
    if (heartbeatGame.active) {
      heartbeatGame.stop();
    } else {
      heartbeatGame.start();
    }
  }

  // Dialogue box test with 'V' key
  if (k === "v") {
    if (game.dialogue) {

      game.dialogue.typewriter.stop();
      game.dialogue = null; // Close dialogue
      

    } else {
      game.dialogue = new dialogueBox(
        "Hello! This is a test dialogue box with typewriter effect. Press V again to close it.",
        "Test Character",
        { sound: typingSound }
      );
    }
  }
}

function keyReleased() {
  const k = key.toLowerCase();
  if (heartbeatGame && heartbeatGame.active && (k === "a" || k === "d")) return;
  if (pressedKeys.hasOwnProperty(k)) pressedKeys[k] = false;
}


function preload() {
  // Audio
  bgMusic = loadSound('assets/music/gamejamtoddler.mp3');
  walkSfx = loadSound('assets/music/walk.mp3');
  heartbeatSound = loadSound('assets/music/heartbeat.mp3');

  // Load the FaceMesh model
  faceMesh = ml5.faceMesh(faceoptions);
  handPose = ml5.handPose(handOptions);


  playerSprite = loadImage('assets/character.png');
  mirrorSprite = loadImage('assets/mirror.png');
  doorSprite = loadImage('assets/Stage_1 bedroom/door.png');
  blackScreenSprite = loadImage('assets/blackScreen.png');
  placeholderSprite = loadImage('assets/placeholder.png');

  // Player animation sprites
  playerStand = loadImage('assets/characters/Stand_toddler.png');
  playerWalkLeft[0] = loadImage('assets/characters/WLeft_toddler.png');
  playerWalkLeft[1] = loadImage('assets/characters/WLeft2_toddler.png');
  playerWalkLeft[2] = loadImage('assets/characters/WLeft_toddler.png');
  playerWalkRight[0] = loadImage('assets/characters/Wright_toddler.png');
  playerWalkRight[1] = loadImage('assets/characters/Wright2_toddler.png');
  playerWalkRight[2] = loadImage('assets/characters/Wright_toddler.png');


  // Font is loaded via CSS in index.html
  // Set the font name for use with textFont()
  schoolbellFont = 'Schoolbell';

  // Loading images
  tooltip = loadImage('assets/tooltip.png');
  cameraMode = loadImage('assets/camera.png');
  keyboardMode = loadImage('assets/keyboard.png');

  aboutBtn = loadImage('assets/aboutButton.png');
  helpBtn = loadImage('assets/helpButton.png');
  closeBtn = loadImage('assets/closeButton.png');

  paper = loadImage('assets/paper.png');
  longPaper = loadImage('assets/longPaper.png');
  barImg = loadImage('assets/bar.png');

  tutorialbarImg = loadImage('assets/tutorial_emptyBar.png');
  tutorialEImg = loadImage('assets/tutorial_extrovered_text.png');
  tutorialIImg = loadImage('assets/tutorial_introverted_text.png');

  returnBtn = loadImage('assets/returnButton.png');

  //loading help images
  help01 = loadImage('assets/Help01.png');
  help02 = loadImage('assets/Help02.png');
  help03 = loadImage('assets/Help03.png');
  help04 = loadImage('assets/Help04.png');

  //load dialogue sound effect
  typingSound = loadSound('assets/music/typing.mp3');

  // Stage 1 bedroom parallax
  bedroomBack = loadImage('assets/Stage_1 bedroom/back_bedroom.png');
  bedroomMid = loadImage('assets/Stage_1 bedroom/mid_bedroom.png');
  bedroomFloor = loadImage('assets/Stage_1 bedroom/floor_bedroom.png');
  bedroomFront = loadImage('assets/Stage_1 bedroom/Front_bedroom.png');
  bedroomDoor = loadImage('assets/Stage_1 bedroom/door.png');

  // Stage 2 living room parallax
  livingroomWall = loadImage('assets/Stage_2 living room/wall_LR.png');
  livingroomFloor = loadImage('assets/Stage_2 living room/Floor_LR.png');
  livingroomMid = loadImage('assets/Stage_2 living room/mid_LR.png');
  livingroomFront = loadImage('assets/Stage_2 living room/front_LR.png');
  livingroomDoor = loadImage('assets/Stage_2 living room/Door_LR.png');

  // Stage 3 school assets (used for stage 2 now)
  schoolWall = loadImage('assets/Stage_3 School/wall_SCH.png');
  schoolFloor = loadImage('assets/Stage_3 School/floor_SCH.png');
  schoolPoster = loadImage('assets/Stage_3 School/poster_SCH.png');
  schoolLockers = loadImage('assets/Stage_3 School/Lockers_SCH.png');
  schoolAssemble = loadImage('assets/Stage_3 School/assenvle_SCH.png');

  // Stage 4 toilet assets (used for stage 3 now)
  toiletBack = loadImage('assets/Stage_4 Toilet/back_toilet.png');
  toiletWall = loadImage('assets/Stage_4 Toilet/Wall_toilet.png');
  toiletFloor = loadImage('assets/Stage_4 Toilet/Floor_toilet.png');
  toiletMid = loadImage('assets/Stage_4 Toilet/mid_toilet.png');
  toiletDoor = loadImage('assets/Stage_4 Toilet/Door_toilet.png');
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
  handPose.detectStart(video, gotHands);

  //create top bar
  header = new Header();

  // Create the game
  game = new Game();
  

}

function draw() {
  game.show();
  console.log(game.stage)

  if (detectHide()) {
    // fill(255, 0, 0); // Red background alert
    // rect(0, 0, width, 50);

    // fill(255);
    // textSize(32);
    // text("MOUTH COVERED! 🫢", 50, 40);
  };

  // Heartbeat rhythm game
  if (heartbeatGame && heartbeatGame.active) {
    heartbeatGame.update();
    heartbeatGame.draw();
  }
}

function modelLoaded() {
  console.log("FaceMesh Model is loaded and ready!");

  //  game.stage = 0;
  //  game.started = true;
  //  game.play = new Stage();

}

// Handle window resizing event so our game won't be seen weird.
// Ref: https://p5js.org/reference/p5/windowResized/
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function gotFaces(results) {
  faces = results;

  //console.log('callback function has been called.');
}

function gotHands(results) {
  hands = results;
  // console.log('callback function has been called.');
}

function updateEnergy() {
  if (game.introvert >= 1.0 || game.extrovert >= 1.0 || game.introvert <= 0.0 || game.extrovert <= 0.0) {
    // stop increasing/decreasing
  }
  else {
    if (game.smiled === 2) {
      game.introvert -= 0.005;
      game.extrovert = 1.000 - game.introvert;
    }
    else if (game.smiled === 1) {
      if (abs(game.introvert - game.extrovert) > 0.01) {
        game.introvert += 0.005;
        game.extrovert = 1.000 - game.introvert;
      }
    }
    else if (game.hid === 2) {
      game.introvert += 0.005;
      game.extrovert = 1.000 - game.introvert;
    }
    else if (game.hid === 1) {
      if (abs(game.introvert - game.extrovert) > 0.01) {
        game.introvert -= 0.005;
        game.extrovert = 1.000 - game.introvert;
      }
    }
  }
}

function detectSmile() {

  // console.log(faces.length);

  if (faces.length != 0 && faces.length > 0 && gameMode === 0) {
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
    // console.log(faceWidth);

    if (mouthWidth / faceWidth > 0.45) { // Adjust based on testing
      // console.log('***smile detected.***');
      game.smiled = 2;
      game.hid = 1;
      updateEnergy();
      return true;
    }
    else {
      // console.log('***smile X***');
      game.smiled = 0;
      updateEnergy();
      return false;
    }
  game.smiled = 1;
  }
}

function detectHide() {
  if (faces.length > 0) {
    let face = faces[0];

    // Get Mouth Center (using upper lip #13 and lower lip #14 as reference)
    let topLip = face.keypoints[13];
    let bottomLip = face.keypoints[14];
    let mouthX = (topLip.x + bottomLip.x) / 2;
    let mouthY = (topLip.y + bottomLip.y) / 2;

    // Draw a marker at the mouth for debugging
    /*
    fill(0, 255, 255);
    noStroke();
    circle(mouthX, mouthY, 10);
    */

    // CHECK HANDS
    if (hands.length > 0) {
      let hand = hands[0];

      // Use the Index Finger Tip (Index 8) and Middle Finger Tip (Index 12)
      // or the Palm Base (Index 0) to check for overlap.
      // Index 9 (Middle Finger MCP) is often a good center point for the hand.
      let handCenter = hand.keypoints[9];

      // fill(255, 0, 255);
      // circle(handCenter.x, handCenter.y, 10);

      // Check distance between Hand Center and Mouth Center
      let d = dist(mouthX, mouthY, handCenter.x, handCenter.y);

      // Threshold: if hand is within 60 pixels of mouth
      if (d < 80) {
        game.hid = 2;
        game.smiled = 1;
        updateEnergy();
        return true;
      }
      else {
        game.hid = 0;
        updateEnergy();
        return false;
      }
    }

    game.hid = 1;
    return false;
  }
}

function mousePressed() {
  // Unlock audio on first user interaction (required by browsers)
  if (typeof userStartAudio === "function") {
    userStartAudio();
  }

  let uiClick;
  // 1. Check Header UI first
  // Ensure 'game.stage' is actually a number
  if (game !== undefined) {
    uiClick = header.clicked(mouseX, mouseY, game.stage);
  }

  // 2. Only check game interactions if the UI wasn't clicked
  if (!uiClick) {
    if (game && game.play) {
      // Stage 0
      if (game.play instanceof startScreen) {
        game.play.modeChanging(mouseX, mouseY);
      }
      // Stage 5
      else if (game.play instanceof Tutorial) {
        let det = game.play.goingBack(mouseX, mouseY);
        if (det) {
          game.stage = 0;
          game.started = false;
        }
      }
    }
  }
}

function mouseWheel(event) {
  // Check if header exists and overlay is open
  if (typeof header !== 'undefined' && header.showOverlay) {
    header.handleScroll(event.delta);
    return false; // Blocks browser scrolling
  }
}