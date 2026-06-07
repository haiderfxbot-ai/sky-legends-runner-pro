class SplashScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.SPLASH });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.cameras.main.setBackgroundColor(0x121212);

        this.createBackground();
        this.createLogo();
        this.createParticles();
        this.createButtons();
        this.createVersion();
        this.setupManagers();

        this.time.delayedCall(100, () => {
            this.cameras.main.fadeIn(500);
        });
    }

    createBackground() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
        bg.fillRect(0, 0, width, height);

        for (let i = 0; i < 50; i++) {
            const star = this.add.graphics();
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            const size = Phaser.Math.Between(1, 3);
            
            star.fillStyle(0xFFFFFF, Phaser.Math.FloatBetween(0.3, 1));
            star.fillCircle(x, y, size);
            
            this.tweens.add({
                targets: star,
                alpha: { from: 0.3, to: 1 },
                duration: Phaser.Math.Between(1000, 3000),
                yoyo: true,
                repeat: -1,
                delay: Phaser.Math.Between(0, 2000)
            });
        }
    }

    createLogo() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.title = this.add.text(width / 2, height / 2 - 180, 'SKY LEGENDS', {
            fontFamily: 'Orbitron',
            fontSize: '42px',
            fontStyle: 'bold',
            color: '#FFFFFF'
        }).setOrigin(0.5).setAlpha(0);

        this.subtitle = this.add.text(width / 2, height / 2 - 120, 'RUNNER', {
            fontFamily: 'Orbitron',
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#00E5FF'
        }).setOrigin(0.5).setAlpha(0);

        this.tagline = this.add.text(width / 2, height / 2 - 70, 'Endless Adventure Awaits', {
            fontFamily: 'Poppins',
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.6)'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: this.title,
            alpha: 1,
            y: height / 2 - 170,
            duration: 800,
            ease: 'Power2'
        });

        this.tweens.add({
            targets: this.subtitle,
            alpha: 1,
            y: height / 2 - 115,
            duration: 800,
            ease: 'Power2',
            delay: 200
        });

        this.tweens.add({
            targets: this.tagline,
            alpha: 1,
            duration: 800,
            delay: 400
        });

        this.tweens.add({
            targets: [this.title, this.subtitle],
            scaleX: { from: 1, to: 1.02 },
            scaleY: { from: 1, to: 1.02 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createParticles() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        for (let i = 0; i < 20; i++) {
            const particle = this.add.graphics();
            const x = Phaser.Math.Between(0, width);
            const startY = Phaser.Math.Between(height, height + 200);
            
            particle.fillStyle(Phaser.Math.RND.pick([0x6750A4, 0x00E5FF, 0x7F67BE]), 0.6);
            particle.fillCircle(0, 0, Phaser.Math.Between(2, 6));
            particle.setPosition(x, startY);
            
            this.tweens.add({
                targets: particle,
                y: -50,
                x: x + Phaser.Math.Between(-100, 100),
                alpha: { from: 0.8, to: 0 },
                duration: Phaser.Math.Between(4000, 8000),
                repeat: -1,
                delay: Phaser.Math.Between(0, 4000),
                onRepeat: () => {
                    particle.setPosition(Phaser.Math.Between(0, width), height + 50);
                }
            });
        }
    }

    createButtons() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.playButton = new GameButton(this, {
            x: width / 2,
            y: height / 2 + 100,
            width: 220,
            height: 60,
            text: 'PLAY',
            color: GAME_CONFIG.COLORS.PRIMARY,
            fontSize: '24px',
            callback: () => this.startGame()
        });
        this.playButton.container.setAlpha(0);
        this.playButton.container.setScale(0.8);

        this.tweens.add({
            targets: this.playButton.container,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            delay: 800,
            ease: 'Back.easeOut'
        });

        this.tweens.add({
            targets: this.playButton.container,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: 1500
        });

        this.settingsButton = new IconButton(this, {
            x: width / 2 - 80,
            y: height / 2 + 200,
            size: 50,
            color: 0x333333,
            icon: '⚙️',
            iconSize: '24px',
            callback: () => this.openSettings()
        });
        this.settingsButton.container.setAlpha(0);

        this.shopButton = new IconButton(this, {
            x: width / 2,
            y: height / 2 + 200,
            size: 50,
            color: 0x333333,
            icon: '🛒',
            iconSize: '24px',
            callback: () => this.openShop()
        });
        this.shopButton.container.setAlpha(0);

        this.profileButton = new IconButton(this, {
            x: width / 2 + 80,
            y: height / 2 + 200,
            size: 50,
            color: 0x333333,
            icon: '👤',
            iconSize: '24px',
            callback: () => this.openProfile()
        });
        this.profileButton.container.setAlpha(0);

        this.tweens.add({
            targets: [this.settingsButton.container, this.shopButton.container, this.profileButton.container],
            alpha: 1,
            duration: 500,
            delay: 1000
        });
    }

    createVersion() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.text(width / 2, height - 40, `v${GAME_CONFIG.GAME_VERSION}`, {
            fontFamily: 'Inter',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.3)'
        }).setOrigin(0.5);

        this.add.text(width / 2, height - 20, 'Made with Phaser 3', {
            fontFamily: 'Inter',
            fontSize: '10px',
            color: 'rgba(255, 255, 255, 0.2)'
        }).setOrigin(0.5);
    }

    setupManagers() {
        audioManager.init(this);
        uiManager.init(this);
    }

    startGame() {
        this.cameras.main.fadeOut(300, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
                this.scene.start(CONSTANTS.SCENES.MAIN_MENU);
            }
        });
    }

    openSettings() {
        notificationManager.info('Settings', 'Settings panel coming soon!');
    }

    openShop() {
        notificationManager.info('Shop', 'Shop coming soon!');
    }

    openProfile() {
        notificationManager.info('Profile', 'Profile panel coming soon!');
    }
}
