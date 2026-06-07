class Toggle extends UIComponent {
    constructor(scene, config = {}) {
        super(scene, config);
        
        this.width = config.width || 60;
        this.height = config.height || 30;
        this.value = config.value || false;
        this.activeColor = config.activeColor || GAME_CONFIG.COLORS.PRIMARY;
        this.inactiveColor = config.inactiveColor || 0x333333;
        this.callback = config.callback;
        
        this.create();
    }

    create() {
        this.bg = this.scene.add.graphics();
        this.knob = this.scene.add.graphics();
        
        this.container.add([this.bg, this.knob]);
        this.container.setSize(this.width, this.height);
        
        this.draw();
        this.setupInteraction();
    }

    draw() {
        this.bg.clear();
        this.bg.fillStyle(this.value ? this.activeColor : this.inactiveColor, 1);
        this.bg.fillRoundedRect(-this.width / 2, -this.height / 2, this.width, this.height, this.height / 2);
        
        this.knob.clear();
        const knobSize = this.height - 6;
        const knobX = this.value ? this.width / 2 - knobSize / 2 - 3 : -this.width / 2 + knobSize / 2 + 3;
        this.knob.fillStyle(0xFFFFFF, 1);
        this.knob.fillCircle(knobX, 0, knobSize / 2);
    }

    setupInteraction() {
        this.container.setInteractive({ useHandCursor: true });
        
        this.container.on('pointerdown', () => {
            this.value = !this.value;
            this.draw();
            if (this.callback) this.callback(this.value);
        });
    }

    setValue(value) {
        this.value = value;
        this.draw();
        return this;
    }

    getValue() {
        return this.value;
    }
}

class Slider extends UIComponent {
    constructor(scene, config = {}) {
        super(scene, config);
        
        this.width = config.width || 200;
        this.height = config.height || 8;
        this.min = config.min || 0;
        this.max = config.max || 1;
        this.value = config.value || 0.5;
        this.trackColor = config.trackColor || 0x333333;
        this.fillColor = config.fillColor || GAME_CONFIG.COLORS.PRIMARY;
        this.callback = config.callback;
        
        this.create();
    }

    create() {
        this.track = this.scene.add.graphics();
        this.fill = this.scene.add.graphics();
        this.knob = this.scene.add.graphics();
        
        this.container.add([this.track, this.fill, this.knob]);
        this.container.setSize(this.width, 30);
        
        this.draw();
        this.setupInteraction();
    }

    draw() {
        this.track.clear();
        this.track.fillStyle(this.trackColor, 1);
        this.track.fillRoundedRect(-this.width / 2, -this.height / 2, this.width, this.height, this.height / 2);
        
        const percent = (this.value - this.min) / (this.max - this.min);
        const fillWidth = this.width * percent;
        
        this.fill.clear();
        if (fillWidth > 0) {
            this.fill.fillStyle(this.fillColor, 1);
            this.fill.fillRoundedRect(-this.width / 2, -this.height / 2, fillWidth, this.height, this.height / 2);
        }
        
        this.knob.clear();
        const knobX = -this.width / 2 + fillWidth;
        this.knob.fillStyle(0xFFFFFF, 1);
        this.knob.fillCircle(knobX, 0, 12);
    }

    setupInteraction() {
        this.container.setInteractive(
            new Phaser.Geom.Rectangle(-this.width / 2, -15, this.width, 30),
            Phaser.Geom.Rectangle.Contains
        );
        
        this.container.on('pointerdown', (pointer) => {
            this.updateValue(pointer);
        });
        
        this.container.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                this.updateValue(pointer);
            }
        });
        
        this.scene.input.on('pointermove', (pointer) => {
            if (pointer.isDown && this.container.input.enabled) {
                const bounds = this.container.getBounds();
                if (bounds.contains(pointer.x, pointer.y)) {
                    this.updateValue(pointer);
                }
            }
        });
    }

    updateValue(pointer) {
        const localX = pointer.x - this.container.x;
        const percent = Phaser.Math.Clamp((localX + this.width / 2) / this.width, 0, 1);
        this.value = this.min + (this.max - this.min) * percent;
        this.draw();
        if (this.callback) this.callback(this.value);
    }

    setValue(value) {
        this.value = Phaser.Math.Clamp(value, this.min, this.max);
        this.draw();
        return this;
    }

    getValue() {
        return this.value;
    }
}

class Avatar extends UIComponent {
    constructor(scene, config = {}) {
        super(scene, config);
        
        this.size = config.size || 40;
        this.character = config.character || 'knight';
        
        this.create();
    }

    create() {
        this.bg = this.scene.add.graphics();
        this.bg.fillStyle(GAME_CONFIG.COLORS.PRIMARY, 1);
        this.bg.fillCircle(0, 0, this.size);
        
        this.border = this.scene.add.graphics();
        this.border.lineStyle(2, 0x00E5FF, 1);
        this.border.strokeCircle(0, 0, this.size);
        
        this.initial = this.scene.add.text(0, 0, this.character.charAt(0).toUpperCase(), {
            fontFamily: 'Orbitron',
            fontSize: `${this.size * 0.8}px`,
            fontStyle: 'bold',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        this.container.add([this.bg, this.border, this.initial]);
        this.container.setSize(this.size * 2, this.size * 2);
    }

    setCharacter(character) {
        this.character = character;
        this.initial.setText(character.charAt(0).toUpperCase());
        return this;
    }
}
