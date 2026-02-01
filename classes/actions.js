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
            game.worldX = 0;
            game.player.x = width / 4;
            game.camera.x = 0;
            if (game.mirrorObstacle) {
              game.mirrorObstacle.triggered = false;
            }
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
            game.worldX = Math.max(game.play.xMin, targetX - width / 2);
            game.player.x = targetX;
            game.camera.x = 0;
            game.mirrorEntryCooldownFrames = 30;
            if (game.mirrorObstacle) {
              game.mirrorObstacle.triggered = false;
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
