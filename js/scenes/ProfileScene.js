class ProfileScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.PROFILE });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x121212);
        this.cameras.main.fadeIn(300);

        this.createBackground();
        this.createHeader();
        this.createProfileInfo();
        this.createStats();
        this.createAchievements();
        this.createBottomNav();
    }

    createBackground() {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
        bg.fillRect(0, 0, 720, 1280);
    }

    createHeader() {
        const backBtn = new IconButton(this, {
            x: 50, y: 50, size: 40, color: 0x333333, icon: '←', iconSize: '20px',
            callback: () => this.scene.start(CONSTANTS.SCENES.MAIN_MENU)
        });
        this.add.text(360, 50, 'PROFILE', {
            fontFamily: 'Orbitron', fontSize: '20px', fontStyle: 'bold', color: '#FFFFFF'
        }).setOrigin(0.5);
    }

    createProfileInfo() {
        const player = saveManager.getPlayerData();
        const avatar = new Avatar(this, { x: 360, y: 180, size: 50, character: player.selectedCharacter });
        this.add.text(360, 250, player.name || 'Player', {
            fontFamily: 'Poppins', fontSize: '24px', fontStyle: 'bold', color: '#FFFFFF'
        }).setOrigin(0.5);
        this.add.text(360, 285, `Level ${player.level}`, {
            fontFamily: 'Orbitron', fontSize: '16px', color: '#00E5FF'
        }).setOrigin(0.5);

        const xpBar = new GameProgressBar(this, {
            x: 360, y: 320, width: 300, height: 12,
            value: playerProgression.getXPProgress(), fillColor: 0x7F67BE
        });
    }

    createStats() {
        const stats = playerProgression.getStats();
        const startY = 400;
        const items = [
            { label: 'High Score', value: Helpers.formatNumber(stats.highScore), color: '#FFD700' },
            { label: 'Best Distance', value: Helpers.formatDistance(stats.bestDistance), color: '#00E5FF' },
            { label: 'Total Runs', value: stats.totalRuns.toString(), color: '#4CAF50' },
            { label: 'Total Coins', value: Helpers.formatNumber(stats.totalCoins), color: '#FFD700' },
            { label: 'Enemies Defeated', value: stats.totalEnemies.toString(), color: '#F44336' },
            { label: 'Bosses Defeated', value: stats.totalBosses.toString(), color: '#9C27B0' }
        ];

        const card = new GameCard(this, { x: 360, y: startY + 100, width: 640, height: 280 });
        this.add(card.container);

        items.forEach((item, i) => {
            const row = Math.floor(i / 2);
            const col = i % 2;
            const x = 160 + col * 280;
            const y = startY + 40 + row * 80;
            this.add.text(x, y, item.label, {
                fontFamily: 'Inter', fontSize: '14px', color: 'rgba(255,255,255,0.6)'
            });
            this.add.text(x + 250, y, item.value, {
                fontFamily: 'Poppins', fontSize: '16px', fontStyle: 'bold', color: item.color
            }).setOrigin(1, 0);
        });
    }

    createAchievements() {
        const achievements = achievementManager.getAllAchievements();
        this.add.text(60, 720, 'ACHIEVEMENTS', {
            fontFamily: 'Orbitron', fontSize: '16px', fontStyle: 'bold', color: '#FFFFFF'
        });
        this.add.text(660, 720, `${achievementManager.getUnlockedCount()}/${achievementManager.getTotalCount()}`, {
            fontFamily: 'Poppins', fontSize: '14px', color: '#00E5FF'
        }).setOrigin(1, 0.5);

        achievements.slice(0, 5).forEach((ach, i) => {
            const y = 770 + i * 50;
            this.add.text(80, y, ach.icon, { fontFamily: 'Inter', fontSize: '20px' });
            this.add.text(120, y, ach.name, {
                fontFamily: 'Poppins', fontSize: '14px', fontStyle: 'bold',
                color: ach.unlocked ? '#FFFFFF' : 'rgba(255,255,255,0.4)'
            });
            if (ach.unlocked) {
                this.add.text(640, y, '✓', {
                    fontFamily: 'Inter', fontSize: '16px', color: '#4CAF50'
                }).setOrigin(1, 0.5);
            }
        });
    }

    createBottomNav() {
        const navBg = this.add.graphics();
        navBg.fillStyle(0x1a1a2e, 0.9);
        navBg.fillRect(0, 1200, 720, 80);
        const navItems = [
            { icon: '🏠', label: 'Home', scene: CONSTANTS.SCENES.MAIN_MENU },
            { icon: '👤', label: 'Profile', active: true },
            { icon: '🏆', label: 'Missions', scene: CONSTANTS.SCENES.MISSION },
            { icon: '🛒', label: 'Shop', scene: CONSTANTS.SCENES.SHOP }
        ];
        navItems.forEach((item, i) => {
            const x = 90 + i * 180;
            this.add.text(x, 1225, item.icon, { fontFamily: 'Inter', fontSize: '24px' }).setOrigin(0.5);
            const color = item.active ? '#00E5FF' : 'rgba(255,255,255,0.5)';
            this.add.text(x, 1255, item.label, {
                fontFamily: 'Inter', fontSize: '10px', color
            }).setOrigin(0.5);
            if (item.scene) {
                this.add.zone(x, 1240, 80, 60).setInteractive().on('pointerdown', () => this.scene.start(item.scene));
            }
        });
    }
}
