class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.BOOT });
    }

    preload() {
        this.createLoadingGraphics();
    }

    create() {
        this.generateTextures();
        this.scene.start(CONSTANTS.SCENES.LOADING);
    }

    createLoadingGraphics() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const loadingBg = this.add.graphics();
        loadingBg.fillStyle(0x121212, 1);
        loadingBg.fillRect(0, 0, width, height);

        const logo = this.add.text(width / 2, height / 2 - 100, 'SKY LEGENDS', {
            fontFamily: 'Orbitron',
            fontSize: '36px',
            fontStyle: 'bold',
            color: '#6750A4'
        }).setOrigin(0.5);

        const subtitle = this.add.text(width / 2, height / 2 - 60, 'RUNNER', {
            fontFamily: 'Orbitron',
            fontSize: '20px',
            color: '#00E5FF'
        }).setOrigin(0.5);

        const loadingText = this.add.text(width / 2, height / 2 + 50, 'Loading...', {
            fontFamily: 'Poppins',
            fontSize: '16px',
            color: '#FFFFFF'
        }).setOrigin(0.5);
    }

    generateTextures() {
        this.generateParticleTextures();
        this.generateUITextures();
        this.generateGameTextures();
    }

    generateParticleTextures() {
        Helpers.createParticleTexture(this, 'particle_coin', 16, 0xFFD700);
        Helpers.createParticleTexture(this, 'particle_dust', 12, 0xFFFFFF);
        Helpers.createParticleTexture(this, 'particle_explosion', 20, 0xF44336);
        Helpers.createParticleTexture(this, 'particle_star', 16, 0x00E5FF);
        Helpers.createParticleTexture(this, 'particle_xp', 10, 0x7F67BE);
        Helpers.createParticleTexture(this, 'particle_spark', 8, 0xFFFFFF);
    }

    generateUITextures() {
        Helpers.createRectangleTexture(this, 'button_bg', 200, 60, GAME_CONFIG.COLORS.PRIMARY, 30);
        Helpers.createRectangleTexture(this, 'button_bg_accent', 200, 60, GAME_CONFIG.COLORS.ACCENT, 30);
        Helpers.createRectangleTexture(this, 'button_bg_success', 200, 60, GAME_CONFIG.COLORS.SUCCESS, 30);
        Helpers.createRectangleTexture(this, 'button_bg_danger', 200, 60, GAME_CONFIG.COLORS.DANGER, 30);
        Helpers.createRectangleTexture(this, 'panel_bg', 400, 600, 0x1E1E1E, 20);
        Helpers.createRectangleTexture(this, 'card_bg', 300, 150, 0x2a2a2a, 16);
        Helpers.createCircleTexture(this, 'circle_button', 25, GAME_CONFIG.COLORS.PRIMARY);
        Helpers.createCircleTexture(this, 'avatar_bg', 40, GAME_CONFIG.COLORS.PRIMARY);
    }

    generateGameTextures() {
        Helpers.createRectangleTexture(this, 'ground', 720, 100, 0x2d5016, 0);
        Helpers.createRectangleTexture(this, 'player', 64, 96, 0x00E5FF, 8);
        Helpers.createRectangleTexture(this, 'platform', 120, 20, 0x8B4513, 4);

        Object.entries(OBSTACLE_TYPES).forEach(([key, type]) => {
            Helpers.createRectangleTexture(this, type.key, type.width, type.height, type.color, 4);
        });

        Object.entries(ENEMY_TYPES).forEach(([key, type]) => {
            Helpers.createRectangleTexture(this, type.key, type.width, type.height, type.color, 4);
        });

        Object.entries(POWERUP_TYPES).forEach(([key, type]) => {
            Helpers.createCircleTexture(this, type.key, 20, type.color);
        });

        Helpers.createCircleTexture(this, 'coin', 15, 0xFFD700);
        Helpers.createDiamondTexture(this, 'gem', 20, 24, 0x00E5FF);
        Helpers.createStarTexture(this, 'star', 20, 5, 0xFFD700);
        Helpers.createCircleTexture(this, 'magnet', 20, 0xF44336);
        Helpers.createCircleTexture(this, 'shield', 20, 0x4CAF50);
        Helpers.createCircleTexture(this, 'speed_boost', 20, 0xFFC107);
        Helpers.createCircleTexture(this, 'double_coin', 20, 0xFFD700);

        Helpers.createRectangleTexture(this, 'bg_sky', 720, 1280, 0x1a1a2e, 0);
        Helpers.createRectangleTexture(this, 'bg_mountains', 720, 400, 0x16213e, 0);
        Helpers.createRectangleTexture(this, 'bg_trees', 720, 200, 0x0f3460, 0);

        this.generateCharacterTextures();
    }

    generateCharacterTextures() {
        const characters = [
            { key: 'character_knight', color: 0x6750A4 },
            { key: 'character_mage', color: 0x00E5FF },
            { key: 'character_ninja', color: 0x333333 },
            { key: 'character_dragon_rider', color: 0xFF5722 },
            { key: 'character_shadow', color: 0x9C27B0 },
            { key: 'character_celestial', color: 0xFFD700 }
        ];

        characters.forEach(char => {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 96;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = `#${char.color.toString(16).padStart(6, '0')}`;
            ctx.beginPath();
            ctx.roundRect(8, 8, 48, 80, 8);
            ctx.fill();

            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.roundRect(16, 16, 32, 32, 4);
            ctx.fill();

            ctx.fillStyle = `#${char.color.toString(16).padStart(6, '0')}`;
            ctx.beginPath();
            ctx.roundRect(14, 60, 16, 30, 4);
            ctx.fill();
            ctx.beginPath();
            ctx.roundRect(34, 60, 16, 30, 4);
            ctx.fill();

            if (this.textures.exists(char.key)) {
                this.textures.remove(char.key);
            }
            this.textures.addCanvas(char.key, canvas);
        });
    }
}
