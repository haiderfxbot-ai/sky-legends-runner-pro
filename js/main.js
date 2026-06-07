window.addEventListener('load', () => {
    const config = {
        ...GAME_CONFIG.PHASER_CONFIG,
        scene: [
            BootScene,
            LoadingScene,
            SplashScene,
            MainMenuScene,
            ProfileScene,
            RewardScene,
            MissionScene,
            LeaderboardScene,
            SettingsScene,
            ShopScene,
            GameplayScene,
            PauseScene,
            GameOverScene,
            VictoryScene
        ]
    };

    const game = new Phaser.Game(config);

    game.events.on('ready', () => {
        console.log(`${GAME_CONFIG.GAME_NAME} v${GAME_CONFIG.GAME_VERSION} initialized`);
    });

    window.addEventListener('resize', () => {
        game.scale.refresh();
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            game.scene.getScenes(true).forEach(scene => {
                if (scene.scene.key === CONSTANTS.SCENES.GAMEPLAY) {
                    scene.scene.pause();
                    scene.scene.launch(CONSTANTS.SCENES.PAUSE);
                }
            });
        }
    });

    document.addEventListener('pause', () => {
        game.scene.getScenes(true).forEach(scene => {
            if (scene.scene.key === CONSTANTS.SCENES.GAMEPLAY) {
                scene.scene.pause();
                scene.scene.launch(CONSTANTS.SCENES.PAUSE);
            }
        });
    });

    document.addEventListener('resume', () => {
        const pauseScene = game.scene.getScene(CONSTANTS.SCENES.PAUSE);
        if (pauseScene && pauseScene.scene.isActive()) {
            pauseScene.scene.stop();
            game.scene.resume(CONSTANTS.SCENES.GAMEPLAY);
        }
    });

    window.game = game;
});
