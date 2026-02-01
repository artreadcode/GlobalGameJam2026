class Actions {
  static run(actionType, actionId, game, obstacle) {
    if (!actionType) return;
    const actionKey = String(actionId);

    switch (actionType) {
      case 'dialogue':
        switch (actionKey) {
          case '1':
            // Placeholder: wire your dialogue renderer to game.dialogue.
            game.dialogue = '...';
            break;
          default:
            break;
        }
        break;


      case 'transition':
        switch (actionKey) {
          case '1':
            // Transition from bedroom (stage 1) to living room (stage 2)
            game.stage = 2;
            game.play = new Stage();
            game.parallax.setStage(2);
            game.worldX = 0; // Start at left edge
            game.player.x = game.worldX + width / 2;
            game.camera.x = 0;
            game.backDoorCooldownFrames = 60; // Prevent immediate back door trigger
            if (game.mirrorObstacle) {
              game.mirrorObstacle.triggered = false;
            }
            if (game.backDoorObstacle) {
              game.backDoorObstacle.triggered = false;
            }
            break;
          case '2':
            // Transition from living room (stage 2) back to bedroom (stage 1)
            game.stage = 1;
            game.play = new Stage();
            game.parallax.setStage(1);
            // Start near the door (right side of bedroom)
            const sceneWidth = game.parallax.getSceneWidth();
            game.worldX = Math.max(0, sceneWidth - width);
            game.player.x = game.worldX + width / 2;
            game.camera.x = 0;
            game.stage1Spawned = false;
            game.stage1CameraOffset = 0;
            game.stage1Centering = false;
            if (game.mirrorObstacle) {
              game.mirrorObstacle.triggered = false;
            }
            if (game.backDoorObstacle) {
              game.backDoorObstacle.triggered = false;
            }
            break;
          case '3':
            // Transition to mirror scene (stage 8)
            game.returnStage = game.stage;
            game.returnScene = game.scene;
            game.returnX = game.worldX;
            game.stage = 8;
            game.play = new MirrorScreen();
            if (game.mirrorMinigame) {
              game.mirrorMinigameActive = true;
              game.mirrorMinigameCompleted = false;
              game.mirrorMinigame.start();
            }
            if (game.mirrorExitObstacle) {
              game.mirrorExitObstacle.triggered = false;
            }
            game.player.x = width / 2;
            game.camera.x = 0;
            break;
          default:
            break;
        }
        break;


      case 'action':
        switch (actionKey) {
          case '1':
            // Custom action hook.
            break;
          case 'mirror':
            console.log('Living room door -> mirror scene (placeholder)');
            break;
          default:
            break;
        }
        break;
      case 'minigame':
        switch (actionKey) {
          case '1':
            if (game.minigame && !game.minigameActive) {
              game.minigameActive = true;
              game.minigame.start();
            }
            break;
          default:
            break;
        }
        break;
      case 'return':
        switch (actionKey) {
          case '1': {
            const targetStage = game.returnStage ?? 1;
            const targetX = game.returnX ?? width / 2;
            game.stage = targetStage;
            game.play = new Stage();
            if (game.mirrorMinigameActive && game.mirrorMinigame) {
              game.mirrorMinigameActive = false;
              game.mirrorMinigame.stop();
            }
            if (game.returnScene !== null && game.returnScene !== undefined) {
              game.scene = game.returnScene;
              game.parallax.setStage(game.stage, game.scene);
            }
            game.worldX = Math.max(game.play.xMin, targetX - width / 2);
            game.player.x = targetX;
            game.camera.x = 0;
            game.mirrorEntryCooldownFrames = 30;
            if (game.mirrorObstacle) {
              game.mirrorObstacle.triggered = false;
            }
            if (game.returnScene !== null && game.returnScene !== undefined) {
              game.scene = game.returnScene;
              game.parallax.setStage(game.stage, game.scene);
            }
            break;
          }
          default:
            break;
        }
        break;
      default:
        break;
    }
  }
}
