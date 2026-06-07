class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.SETTINGS });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x121212);
        this.cameras.main.fadeIn(300);

        this.settings = saveManager.getSettings();
        this.createBackground();
        this.createHeader();
        this.createSettingsContent();
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
        this.add.text(360, 50, 'SETTINGS', {
            fontFamily: 'Orbitron', fontSize: '20px', fontStyle: 'bold', color: '#FFFFFF'
        }).setOrigin(0.5);
    }

    createSettingsContent() {
        let yPos = 130;

        const audioCard = new GameCard(this, { x: 360, y: yPos + 75, width: 640, height: 170 });
        this.add(audioCard.container);
        this.add.text(80, yPos, '🔊 Audio', {
            fontFamily: 'Poppins', fontSize: '18px', fontStyle: 'bold', color: '#FFFFFF'
        });

        yPos += 50;
        this.add.text(80, yPos, 'Music', {
            fontFamily: 'Inter', fontSize: '14px', color: '#FFFFFF'
        });
        const musicToggle = new Toggle(this, {
            x: 600, y: yPos, width: 60, height: 30,
            value: this.settings.musicEnabled,
            callback: (v) => { this.settings.musicEnabled = v; this.saveSettings(); }
        });
        this.add(musicToggle.container);

        yPos += 50;
        this.add.text(80, yPos, 'Sound Effects', {
            fontFamily: 'Inter', fontSize: '14px', color: '#FFFFFF'
        });
        const sfxToggle = new Toggle(this, {
            x: 600, y: yPos, width: 60, height: 30,
            value: this.settings.sfxEnabled,
            callback: (v) => { this.settings.sfxEnabled = v; this.saveSettings(); }
        });
        this.add(sfxToggle.container);

        yPos += 100;
        const gameplayCard = new GameCard(this, { x: 360, y: yPos + 55, width: 640, height: 130 });
        this.add(gameplayCard.container);
        this.add.text(80, yPos, '🎮 Gameplay', {
            fontFamily: 'Poppins', fontSize: '18px', fontStyle: 'bold', color: '#FFFFFF'
        });

        yPos += 50;
        this.add.text(80, yPos, 'Vibration', {
            fontFamily: 'Inter', fontSize: '14px', color: '#FFFFFF'
        });
        const vibToggle = new Toggle(this, {
            x: 600, y: yPos, width: 60, height: 30,
            value: this.settings.vibrations,
            callback: (v) => { this.settings.vibrations = v; this.saveSettings(); }
        });
        this.add(vibToggle.container);

        yPos += 100;
        const volumeCard = new GameCard(this, { x: 360, y: yPos + 75, width: 640, height: 170 });
        this.add(volumeCard.container);
        this.add.text(80, yPos, '🎵 Volume', {
            fontFamily: 'Poppins', fontSize: '18px', fontStyle: 'bold', color: '#FFFFFF'
        });

        yPos += 50;
        this.add.text(80, yPos, 'Music Volume', {
            fontFamily: 'Inter', fontSize: '14px', color: 'rgba(255,255,255,0.7)'
        });
        const musicSlider = new Slider(this, {
            x: 400, y: yPos, width: 300,
            min: 0, max: 1, value: this.settings.musicVolume,
            callback: (v) => { this.settings.musicVolume = v; this.saveSettings(); }
        });
        this.add(musicSlider.container);

        yPos += 50;
        this.add.text(80, yPos, 'SFX Volume', {
            fontFamily: 'Inter', fontSize: '14px', color: 'rgba(255,255,255,0.7)'
        });
        const sfxSlider = new Slider(this, {
            x: 400, y: yPos, width: 300,
            min: 0, max: 1, value: this.settings.sfxVolume,
            callback: (v) => { this.settings.sfxVolume = v; this.saveSettings(); }
        });
        this.add(sfxSlider.container);

        yPos += 100;
        const dangerCard = new GameCard(this, { x: 360, y: yPos + 55, width: 640, height: 130, backgroundColor: 0x2a1515 });
        this.add(dangerCard.container);
        this.add.text(80, yPos, '⚠️ Danger Zone', {
            fontFamily: 'Poppins', fontSize: '18px', fontStyle: 'bold', color: '#F44336'
        });

        yPos += 50;
        const resetBtn = new GameButton(this, {
            x: 360, y: yPos, width: 200, height: 40,
            text: 'Reset Progress', color: 0xF44336, fontSize: '14px',
            callback: () => this.resetProgress()
        });
        this.add(resetBtn.container);
    }

    saveSettings() {
        saveManager.saveSettings(this.settings);
        notificationManager.success('Settings', 'Settings saved!');
    }

    resetProgress() {
        saveManager.clear();
        notificationManager.warning('Progress Reset', 'All data has been cleared');
        this.scene.restart();
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
