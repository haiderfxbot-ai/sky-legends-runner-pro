class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.GAME_OVER });
    }

    create(data) {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x121212);
        this.cameras.main.fadeIn(300);

        this.runData = data || { score: 0, distance: 0, coins: 0, gems: 0, combo: 0, enemies: 0 };

        this.createBackground();
        this.createGameOverTitle();
        this.createStats();
        this.createButtons();
        this.createParticles();

        audioManager.playGameOverSound();
    }

    createBackground() {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a0a0a, 0x2e0a0a, 0x1a0a0a, 0x2e0a0a, 1);
        bg.fillRect(0, 0, 720, 1280);

        for (let i = 0; i < 30; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(0xF44336, Phaser.Math.FloatBetween(0.1, 0.3));
            particle.fillCircle(Phaser.Math.Between(0, 720), Phaser.Math.Between(0, 1280), Phaser.Math.Between(1, 3));
            this.tweens.add({
                targets: particle, alpha: { from: 0.1, to: 0.4 },
                duration: Phaser.Math.Between(2000, 4000), yoyo: true, repeat: -1
            });
        }
    }

    createGameOverTitle() {
        const title = this.add.text(360, 200, 'GAME OVER', {
            fontFamily: 'Orbitron', fontSize: '42px', fontStyle: 'bold', color: '#F44336'
        }).setOrigin(0.5).setAlpha(0).setScale(0.5);

        this.tweens.add({
            targets: title, alpha: 1, scaleX: 1, scaleY: 1,
            duration: 600, ease: 'Back.easeOut', delay: 200
        });

        const subtitle = this.add.text(360, 260, 'Better luck next time!', {
            fontFamily: 'Poppins', fontSize: '16px', color: 'rgba(255,255,255,0.6)'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({ targets: subtitle, alpha: 1, duration: 400, delay: 500 });
    }

    createStats() {
        const startY = 350;
        const stats = [
            { label: 'Score', value: Helpers.formatNumber(this.runData.score), icon: '⭐', color: '#FFD700' },
            { label: 'Distance', value: Helpers.formatDistance(this.runData.distance), icon: '🏃', color: '#00E5FF' },
            { label: 'Coins', value: this.runData.coins.toString(), icon: '💰', color: '#FFD700' },
            { label: 'Gems', value: this.runData.gems.toString(), icon: '💎', color: '#00E5FF' },
            { label: 'Enemies', value: this.runData.enemies.toString(), icon: '⚔️', color: '#F44336' },
            { label: 'Best Combo', value: `${this.runData.combo}x`, icon: '🔥', color: '#FFC107' }
        ];

        const card = new GameCard(this, { x: 360, y: startY + 130, width: 640, height: 300 });
        this.add(card.container);
        card.container.setAlpha(0).setScale(0.9);
        this.tweens.add({ targets: card.container, alpha: 1, scaleX: 1, scaleY: 1, duration: 500, delay: 400 });

        stats.forEach((stat, i) => {
            const row = Math.floor(i / 2);
            const col = i % 2;
            const x = col === 0 ? 140 : 500;
            const y = startY + 40 + row * 90;

            const icon = this.add.text(x - 30, y, stat.icon, { fontFamily: 'Inter', fontSize: '24px' }).setOrigin(0.5).setAlpha(0);
            const value = this.add.text(x + 10, y - 12, stat.value, {
                fontFamily: 'Poppins', fontSize: '22px', fontStyle: 'bold', color: stat.color
            }).setOrigin(0, 0.5).setAlpha(0);
            const label = this.add.text(x + 10, y + 15, stat.label, {
                fontFamily: 'Inter', fontSize: '12px', color: 'rgba(255,255,255,0.5)'
            }).setOrigin(0, 0.5).setAlpha(0);

            this.tweens.add({ targets: [icon, value, label], alpha: 1, duration: 300, delay: 600 + i * 100 });
        });

        const isNewHighScore = this.runData.score >= (saveManager.getPlayerData().highScore || 0);
        if (isNewHighScore && this.runData.score > 0) {
            const newHighScore = this.add.text(360, startY + 300, '🏆 NEW HIGH SCORE! 🏆', {
                fontFamily: 'Orbitron', fontSize: '18px', fontStyle: 'bold', color: '#FFD700'
            }).setOrigin(0.5).setAlpha(0);

            this.tweens.add({
                targets: newHighScore, alpha: 1, scaleX: { from: 0.8, to: 1.1 }, scaleY: { from: 0.8, to: 1.1 },
                duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 1000
            });
        }
    }

    createButtons() {
        const startY = 800;

        const retryBtn = new GameButton(this, {
            x: 360, y: startY, width: 280, height: 55,
            text: 'TRY AGAIN', color: GAME_CONFIG.COLORS.PRIMARY, fontSize: '20px',
            callback: () => this.retryGame()
        });
        retryBtn.container.setAlpha(0);
        this.tweens.add({ targets: retryBtn.container, alpha: 1, duration: 400, delay: 1200 });

        const homeBtn = new GameButton(this, {
            x: 360, y: startY + 75, width: 280, height: 55,
            text: 'HOME', color: 0x333333, fontSize: '20px',
            callback: () => this.goHome()
        });
        homeBtn.container.setAlpha(0);
        this.tweens.add({ targets: homeBtn.container, alpha: 1, duration: 400, delay: 1400 });

        const shareBtn = new GameButton(this, {
            x: 360, y: startY + 150, width: 280, height: 55,
            text: 'SHARE SCORE', color: GAME_CONFIG.COLORS.ACCENT, fontSize: '18px',
            callback: () => this.shareScore()
        });
        shareBtn.container.setAlpha(0);
        this.tweens.add({ targets: shareBtn.container, alpha: 1, duration: 400, delay: 1600 });
    }

    createParticles() {
        for (let i = 0; i < 15; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(0xF44336, 0.4);
            particle.fillCircle(0, 0, Phaser.Math.Between(2, 5));
            particle.setPosition(Phaser.Math.Between(0, 720), Phaser.Math.Between(0, 1280));

            this.tweens.add({
                targets: particle, y: particle.y - 200, alpha: 0,
                duration: Phaser.Math.Between(3000, 6000), repeat: -1,
                delay: Phaser.Math.Between(0, 3000)
            });
        }
    }

    retryGame() {
        audioManager.playButtonSound();
        this.cameras.main.fadeOut(300, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
                this.scene.start(CONSTANTS.SCENES.GAMEPLAY);
            }
        });
    }

    goHome() {
        audioManager.playButtonSound();
        this.cameras.main.fadeOut(300, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
                this.scene.start(CONSTANTS.SCENES.MAIN_MENU);
            }
        });
    }

    shareScore() {
        audioManager.playButtonSound();
        const text = `I scored ${Helpers.formatNumber(this.runData.score)} in Sky Legends Runner! Can you beat my score?`;
        if (navigator.share) {
            navigator.share({ title: 'Sky Legends Runner', text });
        } else {
            notificationManager.info('Share', 'Score copied to clipboard!');
        }
    }
}
