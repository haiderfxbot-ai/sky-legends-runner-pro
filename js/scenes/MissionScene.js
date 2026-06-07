class MissionScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.MISSION });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x121212);
        this.cameras.main.fadeIn(300);

        this.createBackground();
        this.createHeader();
        this.createMissions();
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
        this.add.text(360, 50, 'DAILY MISSIONS', {
            fontFamily: 'Orbitron', fontSize: '20px', fontStyle: 'bold', color: '#FFFFFF'
        }).setOrigin(0.5);

        this.add.text(360, 85, `Resets in ${missionManager.getTimeUntilReset()}`, {
            fontFamily: 'Inter', fontSize: '12px', color: 'rgba(255,255,255,0.5)'
        }).setOrigin(0.5);
    }

    createMissions() {
        const missions = missionManager.getDailyMissions();
        const startY = 150;

        missions.forEach((mission, i) => {
            const y = startY + i * 180;
            const card = new GameCard(this, {
                x: 360, y, width: 640, height: 150
            });
            this.add(card.container);

            this.add.text(80, y - 55, mission.icon, { fontFamily: 'Inter', fontSize: '28px' });
            this.add.text(120, y - 60, mission.name, {
                fontFamily: 'Poppins', fontSize: '18px', fontStyle: 'bold', color: '#FFFFFF'
            });
            this.add.text(120, y - 35, `${mission.type.charAt(0).toUpperCase() + mission.type.slice(1)}: ${mission.value}`, {
                fontFamily: 'Inter', fontSize: '12px', color: 'rgba(255,255,255,0.5)'
            });

            const progressBar = new GameProgressBar(this, {
                x: 360, y: y + 10, width: 500, height: 12,
                value: mission.progressPercent, fillColor: mission.completed ? 0x4CAF50 : 0x6750A4
            });
            this.add(progressBar.container);

            this.add.text(360, y + 35, `${mission.progress}/${mission.value}`, {
                fontFamily: 'Poppins', fontSize: '14px', color: '#FFFFFF'
            }).setOrigin(0.5);

            this.add.text(580, y - 55, `💰 ${mission.reward}`, {
                fontFamily: 'Poppins', fontSize: '16px', fontStyle: 'bold', color: '#FFD700'
            }).setOrigin(1, 0.5);

            if (mission.completed && !mission.claimed) {
                const claimBtn = new GameButton(this, {
                    x: 560, y: y + 10, width: 120, height: 36,
                    text: 'CLAIM', color: 0x4CAF50, fontSize: '14px',
                    callback: () => this.claimReward(mission.id)
                });
                this.add(claimBtn.container);
            } else if (mission.claimed) {
                this.add.text(560, y + 10, '✓ CLAIMED', {
                    fontFamily: 'Poppins', fontSize: '12px', color: '#4CAF50'
                }).setOrigin(0.5);
            }
        });
    }

    claimReward(missionId) {
        const success = missionManager.claimReward(missionId);
        if (success) {
            this.scene.restart();
        }
    }

    createBottomNav() {
        const navBg = this.add.graphics();
        navBg.fillStyle(0x1a1a2e, 0.9);
        navBg.fillRect(0, 1200, 720, 80);
        const navItems = [
            { icon: '🏠', label: 'Home', scene: CONSTANTS.SCENES.MAIN_MENU },
            { icon: '👤', label: 'Profile', scene: CONSTANTS.SCENES.PROFILE },
            { icon: '🏆', label: 'Missions', active: true },
            { icon: '🛒', label: 'Shop', scene: CONSTANTS.SCENES.SHOP }
        ];
        navItems.forEach((item, i) => {
            const x = 90 + i * 180;
            this.add.text(x, 1225, item.icon, { fontFamily: 'Inter', fontSize: '24px' }).setOrigin(0.5);
            const color = item.active ? '#00E5FF' : 'rgba(255,255,255,0.5)';
            this.add.text(x, 1255, item.label, { fontFamily: 'Inter', fontSize: '10px', color }).setOrigin(0.5);
            if (item.scene) {
                this.add.zone(x, 1240, 80, 60).setInteractive().on('pointerdown', () => this.scene.start(item.scene));
            }
        });
    }
}
