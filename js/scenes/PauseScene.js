class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.PAUSE });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const backdrop = this.add.graphics();
        backdrop.fillStyle(0x000000, 0.7);
        backdrop.fillRect(0, 0, width, height);

        const panel = new GamePanel(this, {
            x: width / 2, y: height / 2,
            width: 380, height: 450,
            title: 'PAUSED',
            showCloseButton: false
        });
        this.add(panel.container);

        const resumeBtn = new GameButton(this, {
            x: width / 2, y: height / 2 - 80,
            width: 250, height: 50,
            text: 'RESUME', color: GAME_CONFIG.COLORS.PRIMARY,
            callback: () => this.resumeGame()
        });
        this.add(resumeBtn.container);

        const restartBtn = new GameButton(this, {
            x: width / 2, y: height / 2,
            width: 250, height: 50,
            text: 'RESTART', color: GAME_CONFIG.COLORS.ACCENT,
            callback: () => this.restartGame()
        });
        this.add(restartBtn.container);

        const settingsBtn = new GameButton(this, {
            x: width / 2, y: height / 2 + 80,
            width: 250, height: 50,
            text: 'SETTINGS', color: 0x333333,
            callback: () => this.openSettings()
        });
        this.add(settingsBtn.container);

        const quitBtn = new GameButton(this, {
            x: width / 2, y: height / 2 + 160,
            width: 250, height: 50,
            text: 'QUIT', color: GAME_CONFIG.COLORS.DANGER,
            callback: () => this.quitGame()
        });
        this.add(quitBtn.container);

        this.tweens.add({
            targets: panel.container,
            scaleX: { from: 0.8, to: 1 },
            scaleY: { from: 0.8, to: 1 },
            alpha: { from: 0, to: 1 },
            duration: 300,
            ease: 'Back.easeOut'
        });
    }

    resumeGame() {
        audioManager.playButtonSound();
        this.scene.resume(CONSTANTS.SCENES.GAMEPLAY);
        this.scene.stop();
    }

    restartGame() {
        audioManager.playButtonSound();
        this.scene.stop(CONSTANTS.SCENES.GAMEPLAY);
        this.scene.start(CONSTANTS.SCENES.GAMEPLAY);
    }

    openSettings() {
        audioManager.playButtonSound();
        notificationManager.info('Settings', 'In-game settings coming soon!');
    }

    quitGame() {
        audioManager.playButtonSound();
        this.scene.stop(CONSTANTS.SCENES.GAMEPLAY);
        this.scene.start(CONSTANTS.SCENES.MAIN_MENU);
    }
}
