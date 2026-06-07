class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.MAIN_MENU });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.cameras.main.setBackgroundColor(0x121212);
        this.cameras.main.fadeIn(300);

        this.createBackground();
        this.createHeader();
        this.createMenuButtons();
        this.createDailyReward();
        this.createBottomNav();
        this.setupManagers();

        this.checkDailyReward();
    }

    createBackground() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
        bg.fillRect(0, 0, width, height);

        for (let i = 0; i < 30; i++) {
            const star = this.add.graphics();
            star.fillStyle(0xFFFFFF, Phaser.Math.FloatBetween(0.2, 0.8));
            star.fillCircle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                Phaser.Math.Between(1, 2)
            );
            
            this.tweens.add({
                targets: star,
                alpha: { from: 0.3, to: 0.8 },
                duration: Phaser.Math.Between(1000, 3000),
                yoyo: true,
                repeat: -1
            });
        }

        const mountains = this.add.graphics();
        mountains.fillStyle(0x16213e, 0.5);
        mountains.beginPath();
        mountains.moveTo(0, height);
        mountains.lineTo(0, height - 200);
        mountains.lineTo(150, height - 350);
        mountains.lineTo(300, height - 250);
        mountains.lineTo(450, height - 400);
        mountains.lineTo(600, height - 300);
        mountains.lineTo(720, height - 350);
        mountains.lineTo(720, height);
        mountains.closePath();
        mountains.fill();
    }

    createHeader() {
        const width = this.cameras.main.width;

        const headerBg = this.add.graphics();
        headerBg.fillStyle(0x1a1a2e, 0.8);
        headerBg.fillRect(0, 0, width, 80);

        const player = saveManager.getPlayerData();

        this.avatar = new Avatar(this, {
            x: 50,
            y: 40,
            size: 25,
            character: player.selectedCharacter
        });

        this.playerName = this.add.text(90, 25, player.name || 'Player', {
            fontFamily: 'Poppins',
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#FFFFFF'
        });

        this.playerLevel = this.add.text(90, 50, `Level ${player.level}`, {
            fontFamily: 'Orbitron',
            fontSize: '12px',
            color: '#00E5FF'
        });

        this.currencyDisplay = uiManager.createCurrencyDisplay({
            x: width - 100,
            y: 40,
            coins: player.coins,
            gems: player.gems
        });

        this.settingsBtn = new IconButton(this, {
            x: width - 30,
            y: 40,
            size: 36,
            color: 0x333333,
            icon: '⚙️',
            iconSize: '18px',
            callback: () => this.openSettings()
        });
    }

    createMenuButtons() {
        const width = this.cameras.main.width;
        const startY = 300;

        const menuItems = [
            { text: 'START GAME', color: GAME_CONFIG.COLORS.PRIMARY, callback: () => this.startGame() },
            { text: 'DAILY MISSIONS', color: GAME_CONFIG.COLORS.ACCENT, callback: () => this.openMissions() },
            { text: 'LEADERBOARD', color: GAME_CONFIG.COLORS.SUCCESS, callback: () => this.openLeaderboard() },
            { text: 'SHOP', color: 0xFFC107, callback: () => this.openShop() }
        ];

        this.menuButtons = [];

        menuItems.forEach((item, index) => {
            const button = new GameButton(this, {
                x: width / 2,
                y: startY + index * 80,
                width: 280,
                height: 55,
                text: item.text,
                color: item.color,
                fontSize: '18px',
                callback: item.callback
            });
            button.container.setAlpha(0);
            button.container.setY(startY + index * 80 + 50);

            this.tweens.add({
                targets: button.container,
                alpha: 1,
                y: startY + index * 80,
                duration: 400,
                delay: index * 100,
                ease: 'Power2'
            });

            this.menuButtons.push(button);
        });
    }

    createDailyReward() {
        const width = this.cameras.main.width;

        if (dailyRewardManager.canClaimReward()) {
            this.dailyRewardBtn = new GameButton(this, {
                x: width / 2,
                y: 680,
                width: 200,
                height: 50,
                text: '🎁 DAILY REWARD',
                color: 0xFFD700,
                textColor: '#121212',
                fontSize: '16px',
                callback: () => this.claimDailyReward()
            });

            this.tweens.add({
                targets: this.dailyRewardBtn.container,
                scaleX: { from: 1, to: 1.05 },
                scaleY: { from: 1, to: 1.05 },
                duration: 1000,
                yoyo: true,
                repeat: -1
            });
        }
    }

    createBottomNav() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const navBg = this.add.graphics();
        navBg.fillStyle(0x1a1a2e, 0.9);
        navBg.fillRect(0, height - 80, width, 80);

        const navItems = [
            { icon: '🏠', label: 'Home', scene: CONSTANTS.SCENES.MAIN_MENU },
            { icon: '👤', label: 'Profile', scene: CONSTANTS.SCENES.PROFILE },
            { icon: '🏆', label: 'Missions', scene: CONSTANTS.SCENES.MISSION },
            { icon: '🛒', label: 'Shop', scene: CONSTANTS.SCENES.SHOP }
        ];

        navItems.forEach((item, index) => {
            const x = (width / navItems.length) * index + (width / navItems.length) / 2;
            const y = height - 40;

            const icon = this.add.text(x, y - 12, item.icon, {
                fontFamily: 'Inter',
                fontSize: '24px'
            }).setOrigin(0.5);

            const label = this.add.text(x, y + 14, item.label, {
                fontFamily: 'Inter',
                fontSize: '10px',
                color: 'rgba(255, 255, 255, 0.5)'
            }).setOrigin(0.5);

            const hitArea = this.add.zone(x, y, 80, 60).setInteractive();
            hitArea.on('pointerdown', () => {
                if (item.scene !== CONSTANTS.SCENES.MAIN_MENU) {
                    this.scene.start(item.scene);
                }
            });
        });
    }

    setupManagers() {
        audioManager.init(this);
        uiManager.init(this);
    }

    checkDailyReward() {
        const daily = saveManager.getDaily();
        const lastLogin = daily.lastLogin;
        
        if (lastLogin && !Helpers.isToday(lastLogin)) {
            const daysSince = Helpers.daysBetween(lastLogin, new Date());
            if (daysSince > 1) {
                saveManager.saveDaily({
                    ...daily,
                    loginStreak: 0
                });
            }
        }
    }

    startGame() {
        audioManager.playButtonSound();
        this.cameras.main.fadeOut(300, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
                this.scene.start(CONSTANTS.SCENES.GAMEPLAY);
            }
        });
    }

    openMissions() {
        audioManager.playButtonSound();
        this.scene.start(CONSTANTS.SCENES.MISSION);
    }

    openLeaderboard() {
        audioManager.playButtonSound();
        this.scene.start(CONSTANTS.SCENES.LEADERBOARD);
    }

    openShop() {
        audioManager.playButtonSound();
        this.scene.start(CONSTANTS.SCENES.SHOP);
    }

    openSettings() {
        audioManager.playButtonSound();
        this.scene.start(CONSTANTS.SCENES.SETTINGS);
    }

    claimDailyReward() {
        audioManager.playButtonSound();
        const result = dailyRewardManager.claimReward();
        
        if (result.success) {
            notificationManager.reward(
                'Daily Reward!',
                `Day ${result.day}: ${result.reward.coins} coins${result.reward.gems > 0 ? `, ${result.reward.gems} gems` : ''}`
            );
            
            this.updateCurrencyDisplay();
            
            if (this.dailyRewardBtn) {
                this.dailyRewardBtn.destroy();
            }
        }
    }

    updateCurrencyDisplay() {
        const player = saveManager.getPlayerData();
        if (this.currencyDisplay) {
            this.currencyDisplay.destroy();
        }
        this.currencyDisplay = uiManager.createCurrencyDisplay({
            x: this.cameras.main.width - 100,
            y: 40,
            coins: player.coins,
            gems: player.gems
        });
    }
}
