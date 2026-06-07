class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.LEADERBOARD });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x121212);
        this.cameras.main.fadeIn(300);

        this.createBackground();
        this.createHeader();
        this.createLeaderboard();
        this.createBottomNav();
    }

    createBackground() {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
        bg.fillRect(0, 0, 720, 1280);
    }

    createHeader() {
        new IconButton(this, {
            x: 50, y: 50, size: 40, color: 0x333333, icon: '←', iconSize: '20px',
            callback: () => this.scene.start(CONSTANTS.SCENES.MAIN_MENU)
        });
        this.add.text(360, 50, 'LEADERBOARD', {
            fontFamily: 'Orbitron', fontSize: '20px', fontStyle: 'bold', color: '#FFFFFF'
        }).setOrigin(0.5);
    }

    createLeaderboard() {
        const player = saveManager.getPlayerData();
        const playerStats = playerProgression.getLeaderboardData();

        const mockLeaderboard = [
            { name: 'DragonSlayer', score: 98500, distance: 12500, level: 87 },
            { name: 'ShadowNinja', score: 87200, distance: 11200, level: 72 },
            { name: 'SkyRunner', score: 76800, distance: 9800, level: 65 },
            { name: player.name || 'Player', score: playerStats.highScore, distance: playerStats.bestDistance, level: playerStats.level, isPlayer: true },
            { name: 'MagicMage', score: 54300, distance: 7600, level: 48 },
            { name: 'KnightHero', score: 43200, distance: 6200, level: 38 },
            { name: 'CoinMaster', score: 32100, distance: 4800, level: 29 },
            { name: 'SpeedDemon', score: 21500, distance: 3400, level: 21 }
        ].sort((a, b) => b.score - a.score);

        this.add.text(360, 110, 'TOP SCORES', {
            fontFamily: 'Orbitron', fontSize: '14px', color: '#00E5FF'
        }).setOrigin(0.5);

        const podium = mockLeaderboard.slice(0, 3);
        const podiumColors = [0xFFD700, 0xC0C0C0, 0xCD7F32];
        const podiumY = [280, 340, 320];
        const podiumHeight = [180, 140, 160];

        podium.forEach((entry, i) => {
            const x = 180 + i * 180;
            const y = podiumY[i];

            const bar = this.add.graphics();
            bar.fillStyle(podiumColors[i], 0.3);
            bar.fillRoundedRect(x - 50, y, 100, podiumHeight[i], { tl: 10, tr: 10, bl: 0, br: 0 });

            this.add.text(x, y - 20, `#${i + 1}`, {
                fontFamily: 'Orbitron', fontSize: '18px', fontStyle: 'bold',
                color: `#${podiumColors[i].toString(16).padStart(6, '0')}`
            }).setOrigin(0.5);

            const avatar = new Avatar(this, { x, y: y + 30, size: 20, character: 'knight' });
            this.add.text(x, y + 70, entry.name, {
                fontFamily: 'Poppins', fontSize: '12px', fontStyle: 'bold', color: '#FFFFFF'
            }).setOrigin(0.5);
            this.add.text(x, y + 90, Helpers.formatNumber(entry.score), {
                fontFamily: 'Poppins', fontSize: '14px', fontStyle: 'bold', color: '#FFD700'
            }).setOrigin(0.5);
        });

        const listStartY = 520;
        mockLeaderboard.slice(3).forEach((entry, i) => {
            const y = listStartY + i * 70;
            const bgColor = entry.isPlayer ? 0x6750A4 : 0x1E1E1E;

            const row = this.add.graphics();
            row.fillStyle(bgColor, entry.isPlayer ? 0.3 : 0.8);
            row.fillRoundedRect(60, y, 600, 55, 12);

            this.add.text(90, y + 28, `${i + 4}`, {
                fontFamily: 'Orbitron', fontSize: '14px', color: 'rgba(255,255,255,0.5)'
            }).setOrigin(0, 0.5);

            const avatar = new Avatar(this, { x: 140, y: y + 28, size: 16, character: 'knight' });

            this.add.text(175, y + 15, entry.name, {
                fontFamily: 'Poppins', fontSize: '14px', fontStyle: entry.isPlayer ? 'bold' : 'normal',
                color: entry.isPlayer ? '#00E5FF' : '#FFFFFF'
            });

            this.add.text(175, y + 38, `Lv.${entry.level} • ${Helpers.formatDistance(entry.distance)}`, {
                fontFamily: 'Inter', fontSize: '11px', color: 'rgba(255,255,255,0.5)'
            });

            this.add.text(620, y + 28, Helpers.formatNumber(entry.score), {
                fontFamily: 'Poppins', fontSize: '16px', fontStyle: 'bold', color: '#FFD700'
            }).setOrigin(1, 0.5);
        });
    }

    createBottomNav() {
        const navBg = this.add.graphics();
        navBg.fillStyle(0x1a1a2e, 0.9);
        navBg.fillRect(0, 1200, 720, 80);
        const navItems = [
            { icon: '🏠', label: 'Home', scene: CONSTANTS.SCENES.MAIN_MENU },
            { icon: '👤', label: 'Profile', scene: CONSTANTS.SCENES.PROFILE },
            { icon: '🏆', label: 'Missions', scene: CONSTANTS.SCENES.MISSION },
            { icon: '🛒', label: 'Shop', scene: CONSTANTS.SCENES.SHOP }
        ];
        navItems.forEach((item, i) => {
            const x = 90 + i * 180;
            this.add.text(x, 1225, item.icon, { fontFamily: 'Inter', fontSize: '24px' }).setOrigin(0.5);
            this.add.text(x, 1255, item.label, {
                fontFamily: 'Inter', fontSize: '10px', color: 'rgba(255,255,255,0.5)'
            }).setOrigin(0.5);
            if (item.scene) {
                this.add.zone(x, 1240, 80, 60).setInteractive().on('pointerdown', () => this.scene.start(item.scene));
            }
        });
    }
}
