class GameProgressBar extends UIComponent {
    constructor(scene, config = {}) {
        super(scene, config);
        
        this.width = config.width || 200;
        this.height = config.height || 20;
        this.backgroundColor = config.backgroundColor || 0x333333;
        this.fillColor = config.fillColor || GAME_CONFIG.COLORS.PRIMARY;
        this.value = config.value || 0;
        this.maxValue = config.maxValue || 100;
        this.showText = config.showText || false;
        this.textFormat = config.textFormat || '{value}/{max}';
        this.cornerRadius = config.cornerRadius || this.height / 2;
        this.animated = config.animated !== false;
        
        this.create();
    }

    create() {
        this.bgGraphics = this.scene.add.graphics();
        this.bgGraphics.fillStyle(this.backgroundColor, 1);
        this.bgGraphics.fillRoundedRect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height,
            this.cornerRadius
        );
        
        this.fillGraphics = this.scene.add.graphics();
        this.updateFill();
        
        this.container.add([this.bgGraphics, this.fillGraphics]);
        
        if (this.showText) {
            this.text = this.scene.add.text(0, 0, this.getDisplayText(), {
                fontFamily: 'Poppins',
                fontSize: `${Math.max(10, this.height - 4)}px`,
                fontStyle: 'bold',
                color: '#FFFFFF'
            }).setOrigin(0.5);
            this.container.add(this.text);
        }
        
        this.container.setSize(this.width, this.height);
    }

    updateFill() {
        this.fillGraphics.clear();
        
        const percent = Math.min(1, this.value / this.maxValue);
        const fillWidth = this.width * percent;
        
        if (fillWidth > 0) {
            this.fillGraphics.fillStyle(this.fillColor, 1);
            this.fillGraphics.fillRoundedRect(
                -this.width / 2,
                -this.height / 2,
                fillWidth,
                this.height,
                this.cornerRadius
            );
            
            const highlightHeight = this.height * 0.3;
            this.fillGraphics.fillStyle(0xFFFFFF, 0.15);
            this.fillGraphics.fillRoundedRect(
                -this.width / 2,
                -this.height / 2,
                fillWidth,
                highlightHeight,
                { tl: this.cornerRadius, tr: this.cornerRadius, bl: 0, br: 0 }
            );
        }
        
        if (this.text) {
            this.text.setText(this.getDisplayText());
        }
    }

    getDisplayText() {
        return this.textFormat
            .replace('{value}', Math.floor(this.value))
            .replace('{max}', this.maxValue)
            .replace('{percent}', Math.floor((this.value / this.maxValue) * 100));
    }

    setValue(value, animated = this.animated) {
        const oldValue = this.value;
        this.value = Helpers.clamp(value, 0, this.maxValue);
        
        if (animated && this.scene) {
            this.scene.tweens.addCounter({
                from: oldValue,
                to: this.value,
                duration: 300,
                ease: 'Power2',
                onUpdate: (tween) => {
                    this.value = tween.getValue();
                    this.updateFill();
                }
            });
        } else {
            this.updateFill();
        }
        
        return this;
    }

    setMaxValue(maxValue) {
        this.maxValue = maxValue;
        this.updateFill();
        return this;
    }

    setFillColor(color) {
        this.fillColor = color;
        this.updateFill();
        return this;
    }

    getPercent() {
        return (this.value / this.maxValue) * 100;
    }

    isFull() {
        return this.value >= this.maxValue;
    }

    reset() {
        this.setValue(0, false);
        return this;
    }

    pulse() {
        this.scene.tweens.add({
            targets: this.container,
            scaleX: 1.05,
            scaleY: 1.1,
            duration: 150,
            yoyo: true,
            ease: 'Power2'
        });
        return this;
    }
}

class CircularProgress extends UIComponent {
    constructor(scene, config = {}) {
        super(scene, config);
        
        this.radius = config.radius || 50;
        this.lineWidth = config.lineWidth || 8;
        this.backgroundColor = config.backgroundColor || 0x333333;
        this.fillColor = config.fillColor || GAME_CONFIG.COLORS.PRIMARY;
        this.value = config.value || 0;
        this.maxValue = config.maxValue || 100;
        this.showText = config.showText !== false;
        
        this.create();
    }

    create() {
        this.bgCircle = this.scene.add.graphics();
        this.bgCircle.lineStyle(this.lineWidth, this.backgroundColor, 1);
        this.bgCircle.strokeCircle(0, 0, this.radius);
        
        this.fillCircle = this.scene.add.graphics();
        this.updateFill();
        
        this.container.add([this.bgCircle, this.fillCircle]);
        
        if (this.showText) {
            this.text = this.scene.add.text(0, 0, `${Math.floor(this.getPercent())}%`, {
                fontFamily: 'Poppins',
                fontSize: `${this.radius * 0.5}px`,
                fontStyle: 'bold',
                color: '#FFFFFF'
            }).setOrigin(0.5);
            this.container.add(this.text);
        }
        
        this.container.setSize(this.radius * 2 + this.lineWidth, this.radius * 2 + this.lineWidth);
    }

    updateFill() {
        this.fillCircle.clear();
        
        const percent = this.value / this.maxValue;
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (Math.PI * 2 * percent);
        
        this.fillCircle.lineStyle(this.lineWidth, this.fillColor, 1);
        this.fillCircle.beginPath();
        this.fillCircle.arc(0, 0, this.radius, startAngle, endAngle, false);
        this.fillCircle.strokePath();
        
        if (this.text) {
            this.text.setText(`${Math.floor(this.getPercent())}%`);
        }
    }

    setValue(value) {
        this.value = Helpers.clamp(value, 0, this.maxValue);
        this.updateFill();
        return this;
    }

    getPercent() {
        return (this.value / this.maxValue) * 100;
    }
}
