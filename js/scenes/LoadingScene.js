class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.LOADING });
    }

    preload() {
        this.createLoadingUI();
        this.loadAssets();
    }

    create() {
        this.time.delayedCall(500, () => {
            this.hideLoadingOverlay();
            this.scene.start(CONSTANTS.SCENES.SPLASH);
        });
    }

    createLoadingUI() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.rectangle(width / 2, height / 2, width, height, 0x121212);

        this.logoText = this.add.text(width / 2, height / 2 - 150, 'SKY LEGENDS', {
            fontFamily: 'Orbitron',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#6750A4'
        }).setOrigin(0.5);

        this.subtitleText = this.add.text(width / 2, height / 2 - 110, 'RUNNER', {
            fontFamily: 'Orbitron',
            fontSize: '18px',
            color: '#00E5FF'
        }).setOrigin(0.5);

        const barWidth = 300;
        const barHeight = 6;
        
        this.progressBarBg = this.add.graphics();
        this.progressBarBg.fillStyle(0x333333, 1);
        this.progressBarBg.fillRoundedRect(
            width / 2 - barWidth / 2,
            height / 2,
            barWidth,
            barHeight,
            barHeight / 2
        );

        this.progressBar = this.add.graphics();

        this.loadingText = this.add.text(width / 2, height / 2 + 40, 'Loading assets...', {
            fontFamily: 'Inter',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.6)'
        }).setOrigin(0.5);

        this.percentText = this.add.text(width / 2, height / 2 + 70, '0%', {
            fontFamily: 'Poppins',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: this.logoText,
            alpha: { from: 0.7, to: 1 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }

    loadAssets() {
        this.load.on('progress', (value) => {
            this.updateProgress(value);
        });

        this.load.on('complete', () => {
            this.loadingText.setText('Complete!');
        });

        this.load.on('loaderror', (file) => {
            console.warn('Error loading:', file.key);
        });
    }

    updateProgress(percent) {
        const width = 300;
        const barWidth = width * percent;

        this.progressBar.clear();
        this.progressBar.fillStyle(0x6750A4, 1);
        this.progressBar.fillRoundedRect(
            this.cameras.main.width / 2 - width / 2,
            this.cameras.main.height / 2,
            barWidth,
            6,
            3
        );

        const gradient = this.add.graphics();
        gradient.fillStyle(0x00E5FF, 0.3);
        gradient.fillRoundedRect(
            this.cameras.main.width / 2 - width / 2,
            this.cameras.main.height / 2,
            barWidth,
            3,
            { tl: 3, tr: 3, bl: 0, br: 0 }
        );

        this.percentText.setText(`${Math.floor(percent * 100)}%`);

        const loadingMessages = [
            'Loading assets...',
            'Preparing adventure...',
            'Spawning enemies...',
            'Generating coins...',
            'Almost ready...'
        ];
        const messageIndex = Math.floor(percent * (loadingMessages.length - 1));
        this.loadingText.setText(loadingMessages[messageIndex]);
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }
}
