class Actions {
  static run(actionType, actionId, game, obstacle) {
    if (!actionType) return;

    switch (actionType) {
      case 'dialogue':
        switch (actionId) {
          case '1':
            // Placeholder: wire your dialogue renderer to game.dialogue.
            game.dialogue = '...';
            break;
          default:
            break;
        }
        break;


      case 'transition':
        switch (actionId) {
          case '1':
            // Example: advance to stage 2 when the mirror is touched.
            game.returnStage = game.stage;
            game.returnX = obstacle ? obstacle.x : null;
            game.stage = 4;
            game.play = new MirrorScreen();
            game.player.x = width / 2;
            game.camera.x = 0;
            break;
          default:
            break;
        }
        break;


      case 'action':
        switch (actionId) {
          case '1':
            // Custom action hook.
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }
}
