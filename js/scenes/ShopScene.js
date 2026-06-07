class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.SHOP });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x121212);
        this.cameras.main.fadeIn(300);

        this.currentTab = 0;
        this.createBackground();
        this.createHeader();
        this.createCurrencyDisplay();
        this.createTabBar();
        this.createContent();
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
        this.add.text(360, 50, 'SHOP', {
            fontFamily: 'Orbitron', fontSize: '20px', fontStyle: 'bold', color: '#FFFFFF'
        }).setOrigin(0.5);
    }

    createCurrencyDisplay() {
        const player = saveManager.getPlayerData();
        this.currencyContainer = uiManager.createCurrencyDisplay({
            x: 580, y: 50, coins: player.coins, gems: player.gems
        });
        this.add(this.currencyContainer);
    }

    createTabBar() {
        const tabs = ['Characters', 'Skins', 'Boosters'];
        this.tabBar = new TabBar(this, {
            x: 360, y: 110, width: 640, height: 45,
            tabs, selectedIndex: 0,
            onChange: (index) => { this.currentTab = index; this.refreshContent(); }
        });
        this.add(this.tabBar.container);
    }

    createContent() {
        this.contentGroup = this.add.group();
        this.refreshContent();
    }

    refreshContent() {
        this.contentGroup.clear(true, true);
        const startY = 160;

        switch (this.currentTab) {
            case 0: this.showCharacters(startY); break;
            case 1: this.showSkins(startY); break;
            case 2: this.showBoosters(startY); break;
        }
    }

    showCharacters(startY) {
        const characters = shopManager.getCharacters();
        const cols = 2;
        const cardWidth = 280;
        const cardHeight = 180;
        const gap = 30;

        characters.forEach((char, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = col === 0 ? 200 : 520;
            const y = startY + row * (cardHeight + gap) + cardHeight / 2;

            const card = new ShopCard(this, {
                x, y, width: cardWidth, height: cardHeight,
                itemId: char.id, itemName: char.name,
                itemPrice: char.price, itemCurrency: char.currency,
                owned: char.owned, selected: char.selected,
                callback: (id) => this.purchaseItem('character', id)
            });
            this.contentGroup.add(card.container);

            const desc = this.add.text(x, y + 65, char.description, {
                fontFamily: 'Inter', fontSize: '11px', color: 'rgba(255,255,255,0.5)'
            }).setOrigin(0.5);
            this.contentGroup.add(desc);
        });
    }

    showSkins(startY) {
        const skins = shopManager.getSkins();
        const cols = 2;
        const cardWidth = 280;
        const cardHeight = 180;
        const gap = 30;

        if (skins.length === 0) {
            const emptyText = this.add.text(360, startY + 100, 'No skins available.\nUnlock characters first!', {
                fontFamily: 'Poppins', fontSize: '16px', color: 'rgba(255,255,255,0.5)', align: 'center'
            }).setOrigin(0.5);
            this.contentGroup.add(emptyText);
            return;
        }

        skins.forEach((skin, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = col === 0 ? 200 : 520;
            const y = startY + row * (cardHeight + gap) + cardHeight / 2;

            const card = new ShopCard(this, {
                x, y, width: cardWidth, height: cardHeight,
                itemId: skin.id, itemName: skin.name,
                itemPrice: skin.price, itemCurrency: skin.currency,
                owned: skin.owned, selected: skin.selected,
                callback: (id) => this.purchaseItem('skin', id)
            });
            this.contentGroup.add(card.container);
        });
    }

    showBoosters(startY) {
        const boosters = shopManager.getBoosters();
        const cols = 2;
        const cardWidth = 280;
        const cardHeight = 180;
        const gap = 30;

        boosters.forEach((booster, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = col === 0 ? 200 : 520;
            const y = startY + row * (cardHeight + gap) + cardHeight / 2;

            const card = this.add.container(x, y);
            const bg = this.add.graphics();
            bg.fillStyle(0x1E1E1E, 0.9);
            bg.fillRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 16);
            card.add(bg);

            const iconBg = this.add.graphics();
            iconBg.fillStyle(GAME_CONFIG.COLORS.ACCENT, 0.2);
            iconBg.fillCircle(0, -40, 30);
            card.add(iconBg);

            const icon = this.add.text(0, -40, '⚡', { fontFamily: 'Inter', fontSize: '28px' }).setOrigin(0.5);
            card.add(icon);

            const name = this.add.text(0, 0, booster.name, {
                fontFamily: 'Poppins', fontSize: '14px', fontStyle: 'bold', color: '#FFFFFF'
            }).setOrigin(0.5);
            card.add(name);

            const desc = this.add.text(0, 20, booster.description, {
                fontFamily: 'Inter', fontSize: '11px', color: 'rgba(255,255,255,0.5)'
            }).setOrigin(0.5);
            card.add(desc);

            const priceBg = this.add.graphics();
            const priceColor = booster.currency === 'coins' ? 0xFFD700 : 0x00E5FF;
            priceBg.fillStyle(priceColor, 0.2);
            priceBg.fillRoundedRect(-50, 45, 100, 28, 14);
            card.add(priceBg);

            const priceIcon = booster.currency === 'coins' ? '💰' : '💎';
            const priceText = this.add.text(0, 59, `${priceIcon} ${booster.price}`, {
                fontFamily: 'Poppins', fontSize: '13px', fontStyle: 'bold',
                color: booster.currency === 'coins' ? '#FFD700' : '#00E5FF'
            }).setOrigin(0.5);
            card.add(priceText);

            const countText = this.add.text(cardWidth / 2 - 15, -cardHeight / 2 + 15, `x${booster.count}`, {
                fontFamily: 'Poppins', fontSize: '12px', fontStyle: 'bold', color: '#4CAF50'
            }).setOrigin(1, 0.5);
            card.add(countText);

            card.setSize(cardWidth, cardHeight);
            card.setInteractive({ useHandCursor: true });
            card.on('pointerdown', () => this.purchaseItem('booster', booster.id));

            this.contentGroup.add(card);
        });
    }

    purchaseItem(type, itemId) {
        let result;
        switch (type) {
            case 'character': result = shopManager.purchaseCharacter(itemId); break;
            case 'skin': result = shopManager.purchaseSkin(itemId); break;
            case 'booster': result = shopManager.purchaseBooster(itemId); break;
        }

        if (result && result.success) {
            this.refreshContent();
            this.updateCurrency();
        }
    }

    updateCurrency() {
        const player = saveManager.getPlayerData();
        if (this.currencyContainer) this.currencyContainer.destroy();
        this.currencyContainer = uiManager.createCurrencyDisplay({
            x: 580, y: 50, coins: player.coins, gems: player.gems
        });
        this.add(this.currencyContainer);
    }

    createBottomNav() {
        const navBg = this.add.graphics();
        navBg.fillStyle(0x1a1a2e, 0.9);
        navBg.fillRect(0, 1200, 720, 80);
        const navItems = [
            { icon: '🏠', label: 'Home', scene: CONSTANTS.SCENES.MAIN_MENU },
            { icon: '👤', label: 'Profile', scene: CONSTANTS.SCENES.PROFILE },
            { icon: '🏆', label: 'Missions', scene: CONSTANTS.SCENES.MISSION },
            { icon: '🛒', label: 'Shop', active: true }
        ];
        navItems.forEach((item, i) => {
            const x = 90 + i * 180;
            this.add.text(x, 1225, item.icon, { fontFamily: 'Inter', fontSize: '24px' }).setOrigin(0.5);
            const color = item.active ? '#00E5FF' : 'rgba(255,255,255,0.5)';
            this.add.text(x, 1255, item.label, { fontFamily: 'Inter', fontSize: '10px', color }).setOrigin(0.5);
            if (item.scene) {
                this.add.zone(x, 1240, 80, 60).setInteractive().on('pointerdown', () => this.scene.start(item.scene));
            }
        });
    }
}
