class GamePanel extends UIComponent {
    constructor(scene, config = {}) {
        super(scene, config);
        
        this.width = config.width || 400;
        this.height = config.height || 600;
        this.title = config.title || null;
        this.backgroundColor = config.backgroundColor || 0x1E1E1E;
        this.cornerRadius = config.cornerRadius || 20;
        this.showCloseButton = config.showCloseButton !== false;
        this.onClose = config.onClose;
        
        this.create();
    }

    create() {
        this.backdrop = this.scene.add.graphics();
        this.backdrop.fillStyle(0x000000, 0.7);
        this.backdrop.fillRect(
            -this.scene.cameras.main.width / 2,
            -this.scene.cameras.main.height / 2,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height
        );
        this.container.add(this.backdrop);
        
        this.panelBg = this.scene.add.graphics();
        this.panelBg.fillStyle(this.backgroundColor, 0.98);
        this.panelBg.fillRoundedRect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height,
            this.cornerRadius
        );
        this.container.add(this.panelBg);
        
        this.panelBorder = this.scene.add.graphics();
        this.panelBorder.lineStyle(1, 0xFFFFFF, 0.1);
        this.panelBorder.strokeRoundedRect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height,
            this.cornerRadius
        );
        this.container.add(this.panelBorder);
        
        if (this.title) {
            this.titleBar = this.scene.add.graphics();
            this.titleBar.fillStyle(0x2a2a2a, 1);
            this.titleBar.fillRoundedRect(
                -this.width / 2,
                -this.height / 2,
                this.width,
                60,
                { tl: this.cornerRadius, tr: this.cornerRadius, bl: 0, br: 0 }
            );
            this.container.add(this.titleBar);
            
            this.titleText = this.scene.add.text(0, -this.height / 2 + 30, this.title, {
                fontFamily: 'Orbitron',
                fontSize: '20px',
                fontStyle: 'bold',
                color: '#FFFFFF'
            }).setOrigin(0.5);
            this.container.add(this.titleText);
        }
        
        if (this.showCloseButton) {
            this.closeButton = new IconButton(this.scene, {
                x: this.width / 2 - 30,
                y: -this.height / 2 + 30,
                size: 36,
                color: 0xF44336,
                icon: '✕',
                iconSize: '18px',
                callback: () => this.close()
            });
            this.container.add(this.closeButton.container);
        }
        
        this.contentContainer = this.scene.add.container(0, this.title ? 30 : 0);
        this.container.add(this.contentContainer);
        
        this.container.setSize(this.width, this.height);
        this.backdrop.setInteractive(
            new Phaser.Geom.Rectangle(
                -this.scene.cameras.main.width / 2,
                -this.scene.cameras.main.height / 2,
                this.scene.cameras.main.width,
                this.scene.cameras.main.height
            ),
            Phaser.Geom.Rectangle.Contains
        );
    }

    addContent(element) {
        this.contentContainer.add(element);
        return this;
    }

    removeContent(element) {
        this.contentContainer.remove(element);
        return this;
    }

    clearContent() {
        this.contentContainer.removeAll(true);
        return this;
    }

    open() {
        this.container.setVisible(true);
        this.container.setAlpha(0);
        this.container.setScale(0.8);
        
        this.scene.tweens.add({
            targets: this.container,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
        
        return this;
    }

    close() {
        this.scene.tweens.add({
            targets: this.container,
            alpha: 0,
            scaleX: 0.8,
            scaleY: 0.8,
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                this.container.setVisible(false);
                if (this.onClose) this.onClose();
            }
        });
        
        return this;
    }

    setTitle(title) {
        if (this.titleText) {
            this.titleText.setText(title);
        }
        return this;
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        
        this.panelBg.clear();
        this.panelBg.fillStyle(this.backgroundColor, 0.98);
        this.panelBg.fillRoundedRect(
            -width / 2,
            -height / 2,
            width,
            height,
            this.cornerRadius
        );
        
        this.panelBorder.clear();
        this.panelBorder.lineStyle(1, 0xFFFFFF, 0.1);
        this.panelBorder.strokeRoundedRect(
            -width / 2,
            -height / 2,
            width,
            height,
            this.cornerRadius
        );
        
        this.container.setSize(width, height);
        
        return this;
    }
}

class SettingsPanel extends GamePanel {
    constructor(scene, config = {}) {
        super(scene, {
            ...config,
            title: 'Settings',
            width: 380,
            height: 500
        });
        
        this.createSettingsContent();
    }

    createSettingsContent() {
        const settings = saveManager.getSettings();
        let yPos = -160;
        
        const musicLabel = this.scene.add.text(-140, yPos, 'Music', {
            fontFamily: 'Poppins',
            fontSize: '16px',
            color: '#FFFFFF'
        }).setOrigin(0, 0.5);
        
        this.musicToggle = new Toggle(this.scene, {
            x: 140,
            y: yPos,
            width: 60,
            height: 30,
            value: settings.musicEnabled,
            callback: (value) => {
                saveManager.saveSettings({ musicEnabled: value });
                if (value) audioManager.resumeMusic();
                else audioManager.pauseMusic();
            }
        });
        
        this.contentContainer.add([musicLabel, this.musicToggle.container]);
        
        yPos += 60;
        
        const sfxLabel = this.scene.add.text(-140, yPos, 'Sound Effects', {
            fontFamily: 'Poppins',
            fontSize: '16px',
            color: '#FFFFFF'
        }).setOrigin(0, 0.5);
        
        this.sfxToggle = new Toggle(this.scene, {
            x: 140,
            y: yPos,
            width: 60,
            height: 30,
            value: settings.sfxEnabled,
            callback: (value) => {
                saveManager.saveSettings({ sfxEnabled: value });
            }
        });
        
        this.contentContainer.add([sfxLabel, this.sfxToggle.container]);
        
        yPos += 60;
        
        const vibrationLabel = this.scene.add.text(-140, yPos, 'Vibration', {
            fontFamily: 'Poppins',
            fontSize: '16px',
            color: '#FFFFFF'
        }).setOrigin(0, 0.5);
        
        this.vibrationToggle = new Toggle(this.scene, {
            x: 140,
            y: yPos,
            width: 60,
            height: 30,
            value: settings.vibrations,
            callback: (value) => {
                saveManager.saveSettings({ vibrations: value });
            }
        });
        
        this.contentContainer.add([vibrationLabel, this.vibrationToggle.container]);
        
        yPos += 80;
        
        const musicVolumeLabel = this.scene.add.text(-140, yPos, 'Music Volume', {
            fontFamily: 'Poppins',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.7)'
        }).setOrigin(0, 0.5);
        
        this.musicSlider = new Slider(this.scene, {
            x: 40,
            y: yPos,
            width: 200,
            min: 0,
            max: 1,
            value: settings.musicVolume,
            callback: (value) => {
                saveManager.saveSettings({ musicVolume: value });
                audioManager.setMusicVolume(value);
            }
        });
        
        this.contentContainer.add([musicVolumeLabel, this.musicSlider.container]);
        
        yPos += 50;
        
        const sfxVolumeLabel = this.scene.add.text(-140, yPos, 'SFX Volume', {
            fontFamily: 'Poppins',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.7)'
        }).setOrigin(0, 0.5);
        
        this.sfxSlider = new Slider(this.scene, {
            x: 40,
            y: yPos,
            width: 200,
            min: 0,
            max: 1,
            value: settings.sfxVolume,
            callback: (value) => {
                saveManager.saveSettings({ sfxVolume: value });
                audioManager.setSfxVolume(value);
            }
        });
        
        this.contentContainer.add([sfxVolumeLabel, this.sfxSlider.container]);
    }
}

class ProfilePanel extends GamePanel {
    constructor(scene, config = {}) {
        super(scene, {
            ...config,
            title: 'Profile',
            width: 380,
            height: 550
        });
        
        this.createProfileContent();
    }

    createProfileContent() {
        const player = saveManager.getPlayerData();
        let yPos = -180;
        
        const avatar = new Avatar(this.scene, {
            x: 0,
            y: yPos,
            size: 40,
            character: player.selectedCharacter
        });
        
        const nameText = this.scene.add.text(0, yPos + 60, player.name || 'Player', {
            fontFamily: 'Poppins',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        const levelText = this.scene.add.text(0, yPos + 85, `Level ${player.level}`, {
            fontFamily: 'Orbitron',
            fontSize: '14px',
            color: '#00E5FF'
        }).setOrigin(0.5);
        
        this.contentContainer.add([avatar.container, nameText, levelText]);
        
        yPos += 130;
        
        const stats = [
            { label: 'High Score', value: Helpers.formatNumber(player.highScore || 0), color: '#FFD700' },
            { label: 'Best Distance', value: Helpers.formatDistance(player.bestDistance || 0), color: '#00E5FF' },
            { label: 'Total Runs', value: player.totalRuns || 0, color: '#4CAF50' },
            { label: 'Coins', value: player.totalCoins || 0, color: '#FFD700' },
            { label: 'Enemies Defeated', value: player.totalEnemies || 0, color: '#F44336' }
        ];
        
        stats.forEach((stat, index) => {
            const label = this.scene.add.text(-140, yPos + index * 40, stat.label, {
                fontFamily: 'Inter',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)'
            }).setOrigin(0, 0.5);
            
            const value = this.scene.add.text(140, yPos + index * 40, stat.value.toString(), {
                fontFamily: 'Poppins',
                fontSize: '14px',
                fontStyle: 'bold',
                color: stat.color
            }).setOrigin(1, 0.5);
            
            this.contentContainer.add([label, value]);
        });
    }
}
