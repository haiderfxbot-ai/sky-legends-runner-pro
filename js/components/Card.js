class GameCard extends UIComponent {
    constructor(scene, config = {}) {
        super(scene, config);
        
        this.width = config.width || 300;
        this.height = config.height || 150;
        this.backgroundColor = config.backgroundColor || 0x1E1E1E;
        this.borderColor = config.borderColor || 0xFFFFFF;
        this.borderAlpha = config.borderAlpha || 0.1;
        this.cornerRadius = config.cornerRadius || 16;
        this.title = config.title || null;
        this.subtitle = config.subtitle || null;
        this.icon = config.icon || null;
        
        this.create();
    }

    create() {
        this.bg = this.scene.add.graphics();
        this.bg.fillStyle(this.backgroundColor, 0.95);
        this.bg.fillRoundedRect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height,
            this.cornerRadius
        );
        
        this.border = this.scene.add.graphics();
        this.border.lineStyle(1, this.borderColor, this.borderAlpha);
        this.border.strokeRoundedRect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height,
            this.cornerRadius
        );
        
        this.container.add([this.bg, this.border]);
        
        if (this.title) {
            this.titleText = this.scene.add.text(
                this.icon ? -this.width / 2 + 60 : 0,
                -this.height / 2 + 25,
                this.title,
                {
                    fontFamily: 'Poppins',
                    fontSize: '18px',
                    fontStyle: 'bold',
                    color: '#FFFFFF'
                }
            ).setOrigin(this.icon ? 0 : 0.5);
            this.container.add(this.titleText);
        }
        
        if (this.subtitle) {
            this.subtitleText = this.scene.add.text(
                this.icon ? -this.width / 2 + 60 : 0,
                -this.height / 2 + 50,
                this.subtitle,
                {
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)'
                }
            ).setOrigin(this.icon ? 0 : 0.5);
            this.container.add(this.subtitleText);
        }
        
        if (this.icon) {
            this.iconBg = this.scene.add.graphics();
            this.iconBg.fillStyle(GAME_CONFIG.COLORS.PRIMARY, 0.2);
            this.iconBg.fillRoundedRect(
                -this.width / 2 + 15,
                -25,
                40,
                40,
                10
            );
            
            this.iconText = this.scene.add.text(
                -this.width / 2 + 35,
                -5,
                this.icon,
                {
                    fontFamily: 'Inter',
                    fontSize: '24px'
                }
            ).setOrigin(0.5);
            
            this.container.add([this.iconBg, this.iconText]);
        }
        
        this.container.setSize(this.width, this.height);
    }

    setTitle(title) {
        if (this.titleText) {
            this.titleText.setText(title);
        }
        return this;
    }

    setSubtitle(subtitle) {
        if (this.subtitleText) {
            this.subtitleText.setText(subtitle);
        }
        return this;
    }

    setIcon(icon) {
        if (this.iconText) {
            this.iconText.setText(icon);
        }
        return this;
    }

    addContent(element) {
        this.container.add(element);
        return this;
    }

    highlight(color = GAME_CONFIG.COLORS.ACCENT) {
        this.border.clear();
        this.border.lineStyle(2, color, 1);
        this.border.strokeRoundedRect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height,
            this.cornerRadius
        );
        return this;
    }

    removeHighlight() {
        this.border.clear();
        this.border.lineStyle(1, this.borderColor, this.borderAlpha);
        this.border.strokeRoundedRect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height,
            this.cornerRadius
        );
        return this;
    }
}

class RewardCard extends GameCard {
    constructor(scene, config = {}) {
        super(scene, {
            ...config,
            width: config.width || 120,
            height: config.height || 140
        });
        
        this.rewardType = config.rewardType || 'coins';
        this.rewardAmount = config.rewardAmount || 0;
        this.claimed = config.claimed || false;
        this.day = config.day || 1;
        
        this.createRewardContent();
    }

    createRewardContent() {
        const colors = {
            coins: 0xFFD700,
            gems: 0x00E5FF,
            xp: 0x7F67BE
        };
        
        const icons = {
            coins: '💰',
            gems: '💎',
            xp: '✨'
        };
        
        this.rewardIcon = this.scene.add.text(0, -15, icons[this.rewardType] || '🎁', {
            fontFamily: 'Inter',
            fontSize: '32px'
        }).setOrigin(0.5);
        
        this.rewardAmount = this.scene.add.text(0, 25, `+${this.rewardAmount}`, {
            fontFamily: 'Poppins',
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        this.dayText = this.scene.add.text(0, -55, `Day ${this.day}`, {
            fontFamily: 'Inter',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.6)'
        }).setOrigin(0.5);
        
        this.container.add([this.rewardIcon, this.rewardAmount, this.dayText]);
        
        if (this.claimed) {
            this.container.setAlpha(0.5);
            this.rewardIcon.setText('✓');
        }
    }
}

class ShopCard extends GameCard {
    constructor(scene, config = {}) {
        super(scene, {
            ...config,
            width: config.width || 160,
            height: config.height || 180
        });
        
        this.itemId = config.itemId;
        this.itemName = config.itemName;
        this.itemPrice = config.itemPrice;
        this.itemCurrency = config.itemCurrency;
        this.owned = config.owned || false;
        this.selected = config.selected || false;
        this.callback = config.callback;
        
        this.createShopContent();
    }

    createShopContent() {
        const iconBg = this.scene.add.graphics();
        iconBg.fillStyle(GAME_CONFIG.COLORS.PRIMARY, 0.2);
        iconBg.fillCircle(0, -30, 35);
        
        const icon = this.scene.add.text(0, -30, this.itemName.charAt(0), {
            fontFamily: 'Orbitron',
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        const name = this.scene.add.text(0, 20, this.itemName, {
            fontFamily: 'Poppins',
            fontSize: '14px',
            fontStyle: 'bold',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        this.container.add([iconBg, icon, name]);
        
        if (this.owned) {
            const statusText = this.scene.add.text(0, 45, this.selected ? 'SELECTED' : 'OWNED', {
                fontFamily: 'Inter',
                fontSize: '12px',
                fontStyle: 'bold',
                color: this.selected ? '#00E5FF' : '#4CAF50'
            }).setOrigin(0.5);
            this.container.add(statusText);
        } else {
            const priceBg = this.scene.add.graphics();
            const priceColor = this.itemCurrency === 'coins' ? 0xFFD700 : 0x00E5FF;
            priceBg.fillStyle(priceColor, 0.2);
            priceBg.fillRoundedRect(-40, 45, 80, 24, 12);
            
            const priceIcon = this.itemCurrency === 'coins' ? '💰' : '💎';
            const priceText = this.scene.add.text(0, 57, `${priceIcon} ${this.itemPrice}`, {
                fontFamily: 'Poppins',
                fontSize: '12px',
                fontStyle: 'bold',
                color: this.itemCurrency === 'coins' ? '#FFD700' : '#00E5FF'
            }).setOrigin(0.5);
            
            this.container.add([priceBg, priceText]);
        }
        
        if (!this.owned && this.callback) {
            this.container.setInteractive({ useHandCursor: true });
            this.container.on('pointerdown', () => {
                this.scene.tweens.add({
                    targets: this.container,
                    scaleX: 0.95,
                    scaleY: 0.95,
                    duration: 100,
                    yoyo: true,
                    onComplete: () => {
                        this.callback(this.itemId);
                    }
                });
            });
        }
    }
}
