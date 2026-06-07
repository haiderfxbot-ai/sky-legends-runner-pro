class TabBar extends UIComponent {
    constructor(scene, config = {}) {
        super(scene, config);
        
        this.tabs = config.tabs || [];
        this.selectedIndex = config.selectedIndex || 0;
        this.width = config.width || 350;
        this.height = config.height || 50;
        this.backgroundColor = config.backgroundColor || 0x1a1a1a;
        this.activeColor = config.activeColor || GAME_CONFIG.COLORS.PRIMARY;
        this.textColor = config.textColor || '#FFFFFF';
        this.onChange = config.onChange;
        
        this.create();
    }

    create() {
        this.bg = this.scene.add.graphics();
        this.bg.fillStyle(this.backgroundColor, 0.8);
        this.bg.fillRoundedRect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height,
            this.height / 2
        );
        this.container.add(this.bg);
        
        this.tabWidth = this.width / this.tabs.length;
        this.indicator = this.scene.add.graphics();
        this.container.add(this.indicator);
        
        this.tabTexts = [];
        
        this.tabs.forEach((tab, index) => {
            const x = -this.width / 2 + this.tabWidth * index + this.tabWidth / 2;
            
            const text = this.scene.add.text(x, 0, tab.label || tab, {
                fontFamily: 'Poppins',
                fontSize: '14px',
                fontStyle: index === this.selectedIndex ? 'bold' : 'normal',
                color: index === this.selectedIndex ? this.textColor : 'rgba(255, 255, 255, 0.5)'
            }).setOrigin(0.5);
            
            text.setInteractive({ useHandCursor: true });
            text.on('pointerdown', () => this.selectTab(index));
            
            this.tabTexts.push(text);
            this.container.add(text);
        });
        
        this.updateIndicator();
        this.container.setSize(this.width, this.height);
    }

    updateIndicator() {
        this.indicator.clear();
        
        const x = -this.width / 2 + this.tabWidth * this.selectedIndex;
        
        this.indicator.fillStyle(this.activeColor, 1);
        this.indicator.fillRoundedRect(
            x + 4,
            -this.height / 2 + 4,
            this.tabWidth - 8,
            this.height - 8,
            (this.height - 8) / 2
        );
        
        this.tabTexts.forEach((text, index) => {
            text.setFontStyle(index === this.selectedIndex ? 'bold' : 'normal');
            text.setColor(index === this.selectedIndex ? this.textColor : 'rgba(255, 255, 255, 0.5)');
        });
    }

    selectTab(index) {
        if (index === this.selectedIndex) return;
        if (index < 0 || index >= this.tabs.length) return;
        
        const oldIndex = this.selectedIndex;
        this.selectedIndex = index;
        
        this.updateIndicator();
        
        this.scene.tweens.add({
            targets: this.container,
            scaleX: 0.98,
            scaleY: 0.98,
            duration: 50,
            yoyo: true,
            ease: 'Power2'
        });
        
        if (this.onChange) {
            this.onChange(index, this.tabs[index], oldIndex);
        }
    }

    getSelectedIndex() {
        return this.selectedIndex;
    }

    getSelectedTab() {
        return this.tabs[this.selectedIndex];
    }

    setTabIndex(index) {
        this.selectTab(index);
    }

    addTab(tab) {
        this.tabs.push(tab);
        this.destroy();
        this.create();
    }

    removeTab(index) {
        if (index >= 0 && index < this.tabs.length) {
            this.tabs.splice(index, 1);
            if (this.selectedIndex >= this.tabs.length) {
                this.selectedIndex = this.tabs.length - 1;
            }
            this.destroy();
            this.create();
        }
    }
}
