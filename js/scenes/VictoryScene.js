class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.VICTORY });
    }

    create(data) {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x121212);
        this.cameras.main.fadeIn(300);

        this.victoryData = data || { score: 50000, distance: 5000, coins: 200, gems: 10 };

        this.createBackground();
        this.createVictoryTitle();
        this.createRewards();
        this.createStats();
        this.createButtons();
        this.createCelebration();

        audioManager.playVictorySound();
    }

    createBackground() {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a2e1a, 0x0f3e0f, 0x1a2e1a, 0x0f3e0f, 1);
        bg.fillRect(0, 0, 720, 1280);

        for (let i = 0; i < 50; i++) {
            const star = this.add.graphics();
            star.fillStyle(0xFFD700, Phaser.Math.FloatBetween(0.3, 1));
            star.fillCircle(Phaser.Math.Between(0, 720), Phaser.Math.Between(0, 1280), Phaser.Math.Between(1, 3));
            this.tweens.add({
                targets: star, alpha: { from: 0.3, to: 1 },
                duration: Phaser.Math.Between(500, 2000), yoyo: true, repeat: -1
            });
        }
    }

    createVictoryTitle() {
        const crown = this.add.text(360, 180, '👑', { fontFamily: 'Inter', fontSize: '60px' }).setOrigin(0.5).setAlpha(0);
        this.tweens.add({ targets: crown, alpha: 1, y: 170, duration: 600, ease: 'Back.easeOut', delay: 200 });

        const title = this.add.text(360, 260, 'VICTORY!', {
            fontFamily: 'Orbitron', fontSize: '48px', fontStyle: 'bold', color: '#FFD700'
        }).setOrigin(0.5).setAlpha(0).setScale(0.5);
        this.tweens.add({
            targets: title, alpha: 1, scaleX: 1, scaleY: 1,
            duration: 800, ease: 'Back.easeOut', delay: 400
        });

        const subtitle = this.add.text(360, 320, 'Congratulations, Champion!', {
            fontFamily: 'Poppins', fontSize: '18px', color: 'rgba(255,255,255,0.7)'
        }).setOrigin(0.5).setAlpha(0);
        this.tweens.add({ targets: subtitle, alpha: 1, duration: 400, delay: 700 });
    }

    createRewards() {
        const rewards = [
            { icon: '⭐', amount: Helpers.formatNumber(this.victoryData.score), label: 'Score', color: '#FFD700' },
            { icon: '💰', amount: `+${this.victoryData.coins}`, label: 'Coins', color: '#FFD700' },
            { icon: '💎', amount: `+${this.victoryData.gems}`, label: 'Gems', color: '#00E5FF' }
        ];

        rewards.forEach((reward, i) => {
            const x = 180 + i * 180;
            const y = 430;

            const card = this.add.container(x, y).setAlpha(0).setScale(0.5);

            const bg = this.add.graphics();
            bg.fillStyle(0x1E1E1E, 0.9);
            bg.fillRoundedRect(-70, -50, 140, 100, 16);
            card.add(bg);

            const icon = this.add.text(0, -20, reward.icon, { fontFamily: 'Inter', fontSize: '32px' }).setOrigin(0.5);
            const amount = this.add.text(0, 15, reward.amount, {
                fontFamily: 'Poppins', fontSize: '20px', fontStyle: 'bold', color: reward.color
            }).setOrigin(0.5);
            const label = this.add.text(0, 38, reward.label, {
                fontFamily: 'Inter', fontSize: '11px', color: 'rgba(255,255,255,0.5)'
            }).setOrigin(0.5);

            card.add([icon, amount, label]);
            this.tweens.add({
                targets: card, alpha: 1, scaleX: 1, scaleY: 1,
                duration: 500, ease: 'Back.easeOut', delay: 800 + i * 200
            });
        });
    }

    createStats() {
        const startY = 560;
        const stats = [
            { label: 'Distance Run', value: Helpers.formatDistance(this.victoryData.distance) },
            { label: 'Enemies Defeated', value: (this.victoryData.enemies || 0).toString() },
            { label: 'Max Combo', value: `${this.victoryData.combo || 0}x` }
        ];

        const card = new GameCard(this, { x: 360, y: startY + 60, width: 640, height: 160 });
        this.add(card.container);
        card.container.setAlpha(0);
        this.tweens.add({ targets: card.container, alpha: 1, duration: 400, delay: 1400 });

        stats.forEach((stat, i) => {
            const x = 160 + i * 200;
            const value = this.add.text(x, startY + 40, stat.value, {
                fontFamily: 'Poppins', fontSize: '20px', fontStyle: 'bold', color: '#FFFFFF'
            }).setOrigin(0.5).setAlpha(0);
            const label = this.add.text(x, startY + 70, stat.label, {
                fontFamily: 'Inter', fontSize: '12px', color: 'rgba(255,255,255,0.5)'
            }).setOrigin(0.5).setAlpha(0);
            this.tweens.add({ targets: [value, label], alpha: 1, duration: 300, delay: 1600 + i * 100 });
        });
    }

    createButtons() {
        const startY = 820;

        const continueBtn = new GameButton(this, {
            x: 360, y: startY, width: 280, height: 55,
            text: 'CONTINUE', color: GAME_CONFIG.COLORS.PRIMARY, fontSize: '20px',
            callback: () => this.continueGame()
        });
        continueBtn.container.setAlpha(0);
        this.tweens.add({ targets: continueBtn.container, alpha: 1, duration: 400, delay: 1800 });

        const homeBtn = new GameButton(this, {
            x: 360, y: startY + 75, width: 280, height: 55,
            text: 'HOME', color: 0x333333, fontSize: '20px',
            callback: () => this.goHome()
        });
        homeBtn.container.setAlpha(0);
        this.tweens.add({ targets: homeBtn.container, alpha: 1, duration: 400, delay: 2000 });
    }

    createCelebration() {
        const colors = [0xFFD700, 0x00E5FF, 0x6750A4, 0x4CAF50, 0xF44336];

        for (let i = 0; i < 40; i++) {
            const confetti = this.add.graphics();
            confetti.fillStyle(Phaser.Math.RND.pick(colors), 0.8);
            confetti.fillRect(-5, -10, 10, 20);
            confetti.setPosition(Phaser.Math.Between(0, 720), -50);
            confetti.setDepth(100);

            this.tweens.add({
                targets: confetti,
                y: 1350,
                x: confetti.x + Phaser.Math.Between(-200, 200),
                rotation: Phaser.Math.Between(0, 10),
                duration: Phaser.Math.Between(3000, 6000),
                delay: Phaser.Math.Between(0, 2000),
                repeat: -1
            });
        }
    }

    continueGame() {
        audioManager.playButtonSound();
        this.cameras.main.fadeOut(300, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
                this.scene.start(CONSTANTS.SCENES.MAIN_MENU);
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
}
