class RewardScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.REWARD });
    }

    create(data) {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x121212);
        this.cameras.main.fadeIn(300);

        this.rewardData = data || { coins: 100, gems: 0, xp: 50, title: 'Reward!' };

        this.createBackground();
        this.createRewardDisplay();
        this.createButtons();
    }

    createBackground() {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x16213e, 0x1a1a2e, 0x16213e, 1);
        bg.fillRect(0, 0, 720, 1280);

        for (let i = 0; i < 50; i++) {
            const star = this.add.graphics();
            star.fillStyle(0xFFD700, Phaser.Math.FloatBetween(0.3, 1));
            star.fillCircle(Phaser.Math.Between(0, 720), Phaser.Math.Between(0, 1280), Phaser.Math.Between(1, 3));
            this.tweens.add({
                targets: star, alpha: { from: 0.3, to: 1 },
                duration: Phaser.Math.Between(500, 2000), yoyo: true, repeat: -1
            });
        }
    }

    createRewardDisplay() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height / 2 - 100;

        this.add.text(width / 2, height - 80, this.rewardData.title || 'REWARD!', {
            fontFamily: 'Orbitron', fontSize: '32px', fontStyle: 'bold', color: '#FFD700'
        }).setOrigin(0.5).setAlpha(0).setScale(0.5);

        const titleObj = this.children.list[this.children.list.length - 1];
        this.tweens.add({ targets: titleObj, alpha: 1, scaleX: 1, scaleY: 1, duration: 600, ease: 'Back.easeOut', delay: 200 });

        const rewards = [
            { icon: '💰', amount: this.rewardData.coins, color: '#FFD700', label: 'Coins' },
            { icon: '💎', amount: this.rewardData.gems, color: '#00E5FF', label: 'Gems' },
            { icon: '✨', amount: this.rewardData.xp, color: '#7F67BE', label: 'XP' }
        ].filter(r => r.amount > 0);

        rewards.forEach((reward, i) => {
            const y = height + i * 100;
            const container = this.add.container(width / 2, y).setAlpha(0).setScale(0.5);

            const bg = this.add.graphics();
            bg.fillStyle(0x1E1E1E, 0.9);
            bg.fillRoundedRect(-150, -35, 300, 70, 16);
            container.add(bg);

            const icon = this.add.text(-110, 0, reward.icon, { fontFamily: 'Inter', fontSize: '32px' }).setOrigin(0, 0.5);
            const amount = this.add.text(20, 0, `+${reward.amount}`, {
                fontFamily: 'Poppins', fontSize: '28px', fontStyle: 'bold', color: reward.color
            }).setOrigin(0, 0.5);
            const label = this.add.text(20, 20, reward.label, {
                fontFamily: 'Inter', fontSize: '12px', color: 'rgba(255,255,255,0.5)'
            }).setOrigin(0, 0);

            container.add([icon, amount, label]);
            this.tweens.add({
                targets: container, alpha: 1, scaleX: 1, scaleY: 1,
                duration: 500, ease: 'Back.easeOut', delay: 400 + i * 200
            });
        });
    }

    createButtons() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const continueBtn = new GameButton(this, {
            x: width / 2, y: height - 150, width: 250, height: 55,
            text: 'CONTINUE', color: GAME_CONFIG.COLORS.PRIMARY,
            callback: () => this.scene.start(CONSTANTS.SCENES.MAIN_MENU)
        });
        continueBtn.container.setAlpha(0);
        this.tweens.add({ targets: continueBtn.container, alpha: 1, duration: 400, delay: 1200 });

        const homeBtn = new GameButton(this, {
            x: width / 2, y: height - 80, width: 250, height: 55,
            text: 'HOME', color: 0x333333,
            callback: () => this.scene.start(CONSTANTS.SCENES.MAIN_MENU)
        });
        homeBtn.container.setAlpha(0);
        this.tweens.add({ targets: homeBtn.container, alpha: 1, duration: 400, delay: 1400 });
    }
}
