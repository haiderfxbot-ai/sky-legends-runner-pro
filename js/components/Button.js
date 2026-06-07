class GameButton extends UIComponent {
    constructor(scene, config = {}) {
        super(scene, config);
        
        this.width = config.width || 200;
        this.height = config.height || 60;
        this.text = config.text || 'Button';
        this.color = config.color || GAME_CONFIG.COLORS.PRIMARY;
        this.textColor = config.textColor || '#FFFFFF';
        this.fontSize = config.fontSize || '22px';
        this.fontFamily = config.fontFamily || 'Poppins';
        this.callback = config.callback;
        this.callbackContext = config.callbackContext || scene;
        this.icon = config.icon || null;
        this.disabled = config.disabled || false;
        
        this.create();
    }

    create() {
        this.bg = this.scene.add.graphics();
        this.drawBackground();
        
        this.label = this.scene.add.text(0, 0, this.text, {
            fontFamily: this.fontFamily,
            fontSize: this.fontSize,
            fontStyle: 'bold',
            color: this.textColor
        }).setOrigin(0.5);
        
        if (this.icon) {
            this.iconText = this.scene.add.text(-this.width / 4, 0, this.icon, {
                fontFamily: 'Inter',
                fontSize: this.fontSize
            }).setOrigin(0.5);
            
            this.label.setX(10);
            this.container.add([this.bg, this.iconText, this.label]);
        } else {
            this.container.add([this.bg, this.label]);
        }
        
        this.container.setSize(this.width, this.height);
        this.setupInteraction();
    }

    drawBackground() {
        this.bg.clear();
        
        if (this.disabled) {
            this.bg.fillStyle(0x444444, 0.5);
        } else {
            this.bg.fillStyle(this.color, 1);
        }
        
        this.bg.fillRoundedRect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height,
            this.height / 3
        );
        
        if (!this.disabled) {
            const highlight = this.scene.add.graphics();
            highlight.fillStyle(0xFFFFFF, 0.1);
            highlight.fillRoundedRect(
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height / 2,
                { tl: this.height / 3, tr: this.height / 3, bl: 0, br: 0 }
            );
            this.container.add(highlight);
        }
    }

    setupInteraction() {
        if (this.disabled) return;
        
        this.container.setInteractive({ useHandCursor: true });
        
        this.container.on('pointerover', () => {
            if (!this.disabled) {
                this.scene.tweens.add({
                    targets: this.container,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 100,
                    ease: 'Power2'
                });
            }
        });
        
        this.container.on('pointerout', () => {
            if (!this.disabled) {
                this.scene.tweens.add({
                    targets: this.container,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100,
                    ease: 'Power2'
                });
            }
        });
        
        this.container.on('pointerdown', () => {
            if (!this.disabled) {
                this.scene.tweens.add({
                    targets: this.container,
                    scaleX: 0.95,
                    scaleY: 0.95,
                    duration: 50,
                    ease: 'Power2',
                    onComplete: () => {
                        this.scene.tweens.add({
                            targets: this.container,
                            scaleX: 1.05,
                            scaleY: 1.05,
                            duration: 50,
                            ease: 'Power2',
                            onComplete: () => {
                                this.onClick();
                            }
                        });
                    }
                });
            }
        });
        
        this.container.on('pointerup', () => {
            if (!this.disabled) {
                this.scene.tweens.add({
                    targets: this.container,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100,
                    ease: 'Power2'
                });
            }
        });
    }

    onClick() {
        audioManager.playButtonSound();
        if (this.callback) {
            this.callback.call(this.callbackContext);
        }
    }

    setText(text) {
        this.text = text;
        this.label.setText(text);
        return this;
    }

    setColor(color) {
        this.color = color;
        this.drawBackground();
        return this;
    }

    setDisabled(disabled) {
        this.disabled = disabled;
        this.drawBackground();
        if (disabled) {
            this.container.disableInteractive();
        } else {
            this.setupInteraction();
        }
        return this;
    }

    setCallback(callback, context) {
        this.callback = callback;
        if (context) this.callbackContext = context;
        return this;
    }

    flash(color, duration = 200) {
        const originalColor = this.color;
        this.setColor(color);
        this.scene.time.delayedCall(duration, () => {
            this.setColor(originalColor);
        });
        return this;
    }
}

class IconButton extends UIComponent {
    constructor(scene, config = {}) {
        super(scene, config);
        
        this.size = config.size || 50;
        this.color = config.color || GAME_CONFIG.COLORS.PRIMARY;
        this.icon = config.icon || '★';
        this.iconSize = config.iconSize || '24px';
        this.callback = config.callback;
        this.callbackContext = config.callbackContext || scene;
        
        this.create();
    }

    create() {
        this.bg = this.scene.add.graphics();
        this.bg.fillStyle(this.color, 0.2);
        this.bg.fillCircle(0, 0, this.size / 2);
        
        this.border = this.scene.add.graphics();
        this.border.lineStyle(2, this.color, 0.5);
        this.border.strokeCircle(0, 0, this.size / 2);
        
        this.iconText = this.scene.add.text(0, 0, this.icon, {
            fontFamily: 'Inter',
            fontSize: this.iconSize,
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        this.container.add([this.bg, this.border, this.iconText]);
        this.container.setSize(this.size, this.size);
        this.setupInteraction();
    }

    setupInteraction() {
        this.container.setInteractive({ useHandCursor: true });
        
        this.container.on('pointerdown', () => {
            this.scene.tweens.add({
                targets: this.container,
                scaleX: 0.9,
                scaleY: 0.9,
                duration: 50,
                yoyo: true,
                onComplete: () => {
                    if (this.callback) {
                        this.callback.call(this.callbackContext);
                    }
                }
            });
        });
    }

    setIcon(icon) {
        this.icon = icon;
        this.iconText.setText(icon);
        return this;
    }
}
