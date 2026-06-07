class UIManager {
    constructor() {
        this.scene = null;
        this.elements = {};
        this.containers = {};
    }

    init(scene) {
        this.scene = scene;
    }

    createContainer(key, x, y) {
        const container = this.scene.add.container(x, y);
        this.containers[key] = container;
        return container;
    }

    getContainer(key) {
        return this.containers[key];
    }

    createButton(config) {
        const { x, y, width, height, text, color, fontSize, callback, context } = config;
        
        const container = this.scene.add.container(x, y);
        
        const bg = this.scene.add.graphics();
        bg.fillStyle(color || GAME_CONFIG.COLORS.PRIMARY, 1);
        bg.fillRoundedRect(-width / 2, -height / 2, width, height, height / 4);
        
        const label = this.scene.add.text(0, 0, text, {
            fontFamily: 'Poppins',
            fontSize: fontSize || '20px',
            fontStyle: 'bold',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        container.add([bg, label]);
        container.setSize(width, height);
        container.setInteractive();
        
        container.on('pointerdown', () => {
            this.scene.tweens.add({
                targets: container,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 50,
                yoyo: true,
                onComplete: () => {
                    if (callback) callback.call(context || this.scene);
                }
            });
        });
        
        return container;
    }

    createText(config) {
        const { x, y, text, fontFamily, fontSize, fontStyle, color, origin } = config;
        
        const textObj = this.scene.add.text(x, y, text, {
            fontFamily: fontFamily || 'Poppins',
            fontSize: fontSize || '24px',
            fontStyle: fontStyle || 'normal',
            color: color || '#FFFFFF'
        });
        
        if (origin) {
            textObj.setOrigin(origin);
        }
        
        return textObj;
    }

    createProgressBar(config) {
        const { x, y, width, height, color, value } = config;
        
        const container = this.scene.add.container(x, y);
        
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x333333, 1);
        bg.fillRoundedRect(-width / 2, -height / 2, width, height, height / 2);
        
        const fill = this.scene.add.graphics();
        this.updateProgressBarFill(fill, width, height, value || 0, color || GAME_CONFIG.COLORS.PRIMARY);
        
        container.add([bg, fill]);
        
        container.updateValue = (newValue) => {
            this.updateProgressBarFill(fill, width, height, newValue, color || GAME_CONFIG.COLORS.PRIMARY);
        };
        
        return container;
    }

    updateProgressBarFill(graphics, width, height, value, color) {
        graphics.clear();
        const fillWidth = (width * value) / 100;
        if (fillWidth > 0) {
            graphics.fillStyle(color, 1);
            graphics.fillRoundedRect(-width / 2, -height / 2, fillWidth, height, height / 2);
        }
    }

    createCard(config) {
        const { x, y, width, height, color } = config;
        
        const container = this.scene.add.container(x, y);
        
        const bg = this.scene.add.graphics();
        bg.fillStyle(color || 0x1E1E1E, 0.9);
        bg.fillRoundedRect(-width / 2, -height / 2, width, height, 16);
        
        const border = this.scene.add.graphics();
        border.lineStyle(1, 0xFFFFFF, 0.1);
        border.strokeRoundedRect(-width / 2, -height / 2, width, height, 16);
        
        container.add([bg, border]);
        container.setSize(width, height);
        
        return container;
    }

    createCurrencyDisplay(config) {
        const { x, y, coins, gems } = config;
        
        const container = this.scene.add.container(x, y);
        
        if (coins !== undefined) {
            const coinIcon = this.scene.add.graphics();
            coinIcon.fillStyle(0xFFD700, 1);
            coinIcon.fillCircle(-60, 0, 12);
            
            const coinText = this.scene.add.text(-40, 0, Helpers.formatNumber(coins), {
                fontFamily: 'Poppins',
                fontSize: '18px',
                fontStyle: 'bold',
                color: '#FFD700'
            }).setOrigin(0, 0.5);
            
            container.add([coinIcon, coinText]);
        }
        
        if (gems !== undefined) {
            const gemIcon = this.scene.add.graphics();
            gemIcon.fillStyle(0x00E5FF, 1);
            gemIcon.fillCircle(40, 0, 12);
            
            const gemText = this.scene.add.text(60, 0, Helpers.formatNumber(gems), {
                fontFamily: 'Poppins',
                fontSize: '18px',
                fontStyle: 'bold',
                color: '#00E5FF'
            }).setOrigin(0, 0.5);
            
            container.add([gemIcon, gemText]);
        }
        
        return container;
    }

    createIcon(config) {
        const { x, y, size, color, icon } = config;
        
        const container = this.scene.add.container(x, y);
        
        const bg = this.scene.add.graphics();
        bg.fillStyle(color, 0.2);
        bg.fillCircle(0, 0, size);
        
        const border = this.scene.add.graphics();
        border.lineStyle(2, color, 0.5);
        border.strokeCircle(0, 0, size);
        
        const text = this.scene.add.text(0, 0, icon, {
            fontFamily: 'Poppins',
            fontSize: `${size}px`,
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        container.add([bg, border, text]);
        
        return container;
    }

    createPanel(config) {
        const { x, y, width, height, title } = config;
        
        const container = this.scene.add.container(x, y);
        
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x1E1E1E, 0.95);
        bg.fillRoundedRect(-width / 2, -height / 2, width, height, 20);
        
        const border = this.scene.add.graphics();
        border.lineStyle(1, 0xFFFFFF, 0.1);
        border.strokeRoundedRect(-width / 2, -height / 2, width, height, 20);
        
        container.add([bg, border]);
        
        if (title) {
            const titleText = this.scene.add.text(0, -height / 2 + 30, title, {
                fontFamily: 'Orbitron',
                fontSize: '24px',
                fontStyle: 'bold',
                color: '#FFFFFF'
            }).setOrigin(0.5);
            container.add(titleText);
        }
        
        container.setSize(width, height);
        
        return container;
    }

    createAvatar(config) {
        const { x, y, size, character, skin } = config;
        
        const container = this.scene.add.container(x, y);
        
        const bg = this.scene.add.graphics();
        bg.fillStyle(GAME_CONFIG.COLORS.PRIMARY, 1);
        bg.fillCircle(0, 0, size);
        
        const border = this.scene.add.graphics();
        border.lineStyle(3, 0x00E5FF, 1);
        border.strokeCircle(0, 0, size);
        
        const initial = this.scene.add.text(0, 0, character ? character.charAt(0).toUpperCase() : 'P', {
            fontFamily: 'Orbitron',
            fontSize: `${size}px`,
            fontStyle: 'bold',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        container.add([bg, border, initial]);
        
        return container;
    }

    createToggle(config) {
        const { x, y, width, height, value, callback } = config;
        
        const container = this.scene.add.container(x, y);
        
        const bg = this.scene.add.graphics();
        const bgColor = value ? GAME_CONFIG.COLORS.PRIMARY : 0x333333;
        bg.fillStyle(bgColor, 1);
        bg.fillRoundedRect(-width / 2, -height / 2, width, height, height / 2);
        
        const knobSize = height - 8;
        const knobX = value ? width / 2 - knobSize / 2 - 4 : -width / 2 + knobSize / 2 + 4;
        const knob = this.scene.add.graphics();
        knob.fillStyle(0xFFFFFF, 1);
        knob.fillCircle(knobX, 0, knobSize / 2);
        
        container.add([bg, knob]);
        container.setSize(width, height);
        container.setInteractive();
        
        let isOn = value;
        
        container.on('pointerdown', () => {
            isOn = !isOn;
            
            bg.clear();
            bg.fillStyle(isOn ? GAME_CONFIG.COLORS.PRIMARY : 0x333333, 1);
            bg.fillRoundedRect(-width / 2, -height / 2, width, height, height / 2);
            
            const newKnobX = isOn ? width / 2 - knobSize / 2 - 4 : -width / 2 + knobSize / 2 + 4;
            knob.clear();
            knob.fillStyle(0xFFFFFF, 1);
            knob.fillCircle(newKnobX, 0, knobSize / 2);
            
            if (callback) callback(isOn);
        });
        
        container.setValue = (newValue) => {
            isOn = newValue;
            bg.clear();
            bg.fillStyle(isOn ? GAME_CONFIG.COLORS.PRIMARY : 0x333333, 1);
            bg.fillRoundedRect(-width / 2, -height / 2, width, height, height / 2);
            
            const newKnobX = isOn ? width / 2 - knobSize / 2 - 4 : -width / 2 + knobSize / 2 + 4;
            knob.clear();
            knob.fillStyle(0xFFFFFF, 1);
            knob.fillCircle(newKnobX, 0, knobSize / 2);
        };
        
        return container;
    }

    createSlider(config) {
        const { x, y, width, min, max, value, callback } = config;
        
        const container = this.scene.add.container(x, y);
        const height = 8;
        
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x333333, 1);
        bg.fillRoundedRect(-width / 2, -height / 2, width, height, height / 2);
        
        const fillPercent = (value - min) / (max - min);
        const fill = this.scene.add.graphics();
        fill.fillStyle(GAME_CONFIG.COLORS.PRIMARY, 1);
        fill.fillRoundedRect(-width / 2, -height / 2, width * fillPercent, height, height / 2);
        
        const knobSize = 24;
        const knobX = -width / 2 + width * fillPercent;
        const knob = this.scene.add.graphics();
        knob.fillStyle(0xFFFFFF, 1);
        knob.fillCircle(knobX, 0, knobSize / 2);
        
        container.add([bg, fill, knob]);
        container.setSize(width, knobSize + 10);
        container.setInteractive({ draggable: true });
        
        let currentValue = value;
        
        container.on('drag', (pointer, dragX) => {
            const clampedX = Helpers.clamp(dragX, -width / 2, width / 2);
            const percent = (clampedX + width / 2) / width;
            currentValue = min + (max - min) * percent;
            
            fill.clear();
            fill.fillStyle(GAME_CONFIG.COLORS.PRIMARY, 1);
            fill.fillRoundedRect(-width / 2, -height / 2, width * percent, height, height / 2);
            
            knob.clear();
            knob.fillStyle(0xFFFFFF, 1);
            knob.fillCircle(clampedX, 0, knobSize / 2);
            
            if (callback) callback(currentValue);
        });
        
        container.getValue = () => currentValue;
        container.setValue = (newValue) => {
            currentValue = newValue;
            const percent = (newValue - min) / (max - min);
            const knobXPos = -width / 2 + width * percent;
            
            fill.clear();
            fill.fillStyle(GAME_CONFIG.COLORS.PRIMARY, 1);
            fill.fillRoundedRect(-width / 2, -height / 2, width * percent, height, height / 2);
            
            knob.clear();
            knob.fillStyle(0xFFFFFF, 1);
            knob.fillCircle(knobXPos, 0, knobSize / 2);
        };
        
        return container;
    }

    destroy() {
        Object.values(this.containers).forEach(container => {
            if (container) container.destroy();
        });
        this.containers = {};
        this.elements = {};
    }
}

const uiManager = new UIManager();
