class UIComponent {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.container = scene.add.container(config.x || 0, config.y || 0);
        this.elements = {};
        this.visible = true;
        this.interactive = true;
    }

    show() {
        this.visible = true;
        this.container.setVisible(true);
        this.container.setAlpha(1);
        return this;
    }

    hide() {
        this.visible = false;
        this.container.setVisible(false);
        return this;
    }

    setAlpha(alpha) {
        this.container.setAlpha(alpha);
        return this;
    }

    setPosition(x, y) {
        this.container.setPosition(x, y);
        return this;
    }

    setScale(scale) {
        this.container.setScale(scale);
        return this;
    }

    setDepth(depth) {
        this.container.setDepth(depth);
        return this;
    }

    add(element) {
        this.container.add(element);
        return this;
    }

    remove(element) {
        this.container.remove(element);
        return this;
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
        }
        this.elements = {};
    }

    fadeIn(duration = 300) {
        this.container.setAlpha(0);
        this.container.setVisible(true);
        
        this.scene.tweens.add({
            targets: this.container,
            alpha: 1,
            duration,
            ease: 'Power2'
        });
        
        return this;
    }

    fadeOut(duration = 300, onComplete) {
        this.scene.tweens.add({
            targets: this.container,
            alpha: 0,
            duration,
            ease: 'Power2',
            onComplete: () => {
                this.container.setVisible(false);
                if (onComplete) onComplete();
            }
        });
        
        return this;
    }

    scaleIn(duration = 300) {
        this.container.setScale(0);
        this.container.setVisible(true);
        
        this.scene.tweens.add({
            targets: this.container,
            scaleX: 1,
            scaleY: 1,
            duration,
            ease: 'Back.easeOut'
        });
        
        return this;
    }

    scaleOut(duration = 300, onComplete) {
        this.scene.tweens.add({
            targets: this.container,
            scaleX: 0,
            scaleY: 0,
            duration,
            ease: 'Back.easeIn',
            onComplete: () => {
                this.container.setVisible(false);
                if (onComplete) onComplete();
            }
        });
        
        return this;
    }

    slideIn(direction = 'left', duration = 300) {
        const startX = direction === 'left' ? -this.scene.cameras.main.width : 
                       direction === 'right' ? this.scene.cameras.main.width : 0;
        const startY = direction === 'up' ? this.scene.cameras.main.height : 
                       direction === 'down' ? -this.scene.cameras.main.height : 0;
        
        this.container.setPosition(this.container.x + startX, this.container.y + startY);
        this.container.setVisible(true);
        
        this.scene.tweens.add({
            targets: this.container,
            x: this.container.x - startX,
            y: this.container.y - startY,
            duration,
            ease: 'Power2'
        });
        
        return this;
    }

    bounceIn(duration = 500) {
        this.container.setScale(0);
        this.container.setVisible(true);
        
        this.scene.tweens.add({
            targets: this.container,
            scaleX: 1,
            scaleY: 1,
            duration,
            ease: 'Bounce.easeOut'
        });
        
        return this;
    }

    shake(intensity = 5, duration = 300) {
        this.scene.tweens.add({
            targets: this.container,
            x: this.container.x + intensity,
            duration: 50,
            yoyo: true,
            repeat: Math.floor(duration / 100),
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.container,
                    x: this.container.x,
                    duration: 50
                });
            }
        });
        
        return this;
    }

    pulse(scale = 1.1, duration = 200) {
        this.scene.tweens.add({
            targets: this.container,
            scaleX: scale,
            scaleY: scale,
            duration,
            yoyo: true,
            ease: 'Power2'
        });
        
        return this;
    }

    enableInteractive(hint) {
        this.container.setInteractive(hint);
        this.interactive = true;
        return this;
    }

    disableInteractive() {
        this.container.disableInteractive();
        this.interactive = false;
        return this;
    }

    on(event, callback, context) {
        this.container.on(event, callback, context);
        return this;
    }

    off(event, callback) {
        this.container.off(event, callback);
        return this;
    }

    getBounds() {
        return this.container.getBounds();
    }

    setSize(width, height) {
        this.container.setSize(width, height);
        return this;
    }
}
