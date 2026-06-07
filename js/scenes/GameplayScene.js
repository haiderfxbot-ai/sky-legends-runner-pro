class GameplayScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.GAMEPLAY });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x121212);
        this.cameras.main.fadeIn(300);

        this.gameState = CONSTANTS.STATES.IDLE;
        this.score = 0;
        this.distance = 0;
        this.coins = 0;
        this.gems = 0;
        this.combo = 0;
        this.comboTimer = null;
        this.scrollSpeed = GAME_CONFIG.SCROLL.BASE_SPEED;
        this.isInvincible = false;
        this.activePowerups = {};
        this.enemiesDefeated = 0;
        this.bossesDefeated = 0;
        this.startTime = Date.now();
        this.runXP = 0;

        this.createBackground();
        this.createGround();
        this.createPlayer();
        this.createUI();
        this.createObstacles();
        this.createCollectibles();
        this.createEnemies();
        this.createPowerups();
        this.setupInput();
        this.setupCollisions();
        this.startSpawning();
        this.startGame();
    }

    createBackground() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.bgLayers = [];
        const colors = [
            [0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e],
            [0x16213e, 0x16213e, 0x0f3460, 0x0f3460],
            [0x0f3460, 0x0f3460, 0x1a1a2e, 0x1a1a2e]
        ];

        colors.forEach((colorSet, i) => {
            const bg = this.add.graphics();
            bg.fillGradientStyle(colorSet[0], colorSet[1], colorSet[2], colorSet[3], 1);
            bg.fillRect(0, 0, width, height);
            bg.setDepth(GAME_CONFIG.LAYERS.BACKGROUND + i);
            this.bgLayers.push({ graphic: bg, speed: 0.1 * (i + 1) });
        });

        for (let i = 0; i < 40; i++) {
            const star = this.add.graphics();
            star.fillStyle(0xFFFFFF, Phaser.Math.FloatBetween(0.2, 0.8));
            star.fillCircle(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height / 2), Phaser.Math.Between(1, 2));
            star.setDepth(GAME_CONFIG.LAYERS.BACKGROUND);
            this.bgLayers.push({ graphic: star, speed: 0.05 });
        }
    }

    createGround() {
        const width = this.cameras.main.width;
        const groundY = GAME_CONFIG.SCROLL.GROUND_Y;

        this.ground = this.add.tileSprite(0, groundY, width, 200, 'ground');
        this.ground.setOrigin(0, 0);
        this.ground.setDepth(GAME_CONFIG.LAYERS.GROUND);

        this.groundBody = this.physics.add.staticGroup();
        const groundRect = this.add.rectangle(width / 2, groundY + 100, width, 20);
        groundRect.setVisible(false);
        this.groundBody.add(groundRect);
    }

    createPlayer() {
        const startX = GAME_CONFIG.PLAYER.START_X;
        const startY = GAME_CONFIG.SCROLL.GROUND_Y - 80;

        this.player = this.physics.add.sprite(startX, startY, 'player');
        this.player.setDepth(GAME_CONFIG.LAYERS.PLAYER);
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(GAME_CONFIG.PHYSICS.GRAVITY);
        this.player.body.setSize(48, 80);
        this.player.body.setOffset(8, 8);

        this.playerState = CONSTANTS.STATES.IDLE;
        this.canDoubleJump = true;
        this.jumpCount = 0;

        this.playerTrail = [];
    }

    createUI() {
        this.uiContainer = this.add.container(0, 0);
        this.uiContainer.setDepth(GAME_CONFIG.LAYERS.UI);

        const scoreBg = this.add.graphics();
        scoreBg.fillStyle(0x000000, 0.4);
        scoreBg.fillRoundedRect(20, 50, 180, 50, 25);
        this.uiContainer.add(scoreBg);

        this.scoreText = this.add.text(110, 62, '0', {
            fontFamily: 'Orbitron', fontSize: '28px', fontStyle: 'bold', color: '#FFFFFF'
        }).setOrigin(0.5);
        this.uiContainer.add(this.scoreText);

        this.scoreLabel = this.add.text(110, 88, 'SCORE', {
            fontFamily: 'Inter', fontSize: '10px', color: 'rgba(255,255,255,0.5)'
        }).setOrigin(0.5);
        this.uiContainer.add(this.scoreLabel);

        const coinBg = this.add.graphics();
        coinBg.fillStyle(0x000000, 0.4);
        coinBg.fillRoundedRect(520, 50, 100, 35, 18);
        this.uiContainer.add(coinBg);

        this.coinIcon = this.add.text(540, 67, '💰', { fontFamily: 'Inter', fontSize: '16px' }).setOrigin(0, 0.5);
        this.uiContainer.add(this.coinIcon);

        this.coinText = this.add.text(565, 67, '0', {
            fontFamily: 'Poppins', fontSize: '16px', fontStyle: 'bold', color: '#FFD700'
        }).setOrigin(0, 0.5);
        this.uiContainer.add(this.coinText);

        const gemBg = this.add.graphics();
        gemBg.fillStyle(0x000000, 0.4);
        gemBg.fillRoundedRect(630, 50, 70, 35, 18);
        this.uiContainer.add(gemBg);

        this.gemText = this.add.text(655, 67, '0', {
            fontFamily: 'Poppins', fontSize: '16px', fontStyle: 'bold', color: '#00E5FF'
        }).setOrigin(0.5);
        this.uiContainer.add(this.gemText);

        this.comboText = this.add.text(360, 130, '', {
            fontFamily: 'Orbitron', fontSize: '32px', fontStyle: 'bold', color: '#FFD700'
        }).setOrigin(0.5).setAlpha(0);
        this.uiContainer.add(this.comboText);

        this.distanceText = this.add.text(360, 1240, '0m', {
            fontFamily: 'Poppins', fontSize: '14px', color: 'rgba(255,255,255,0.6)'
        }).setOrigin(0.5);
        this.uiContainer.add(this.distanceText);

        this.pauseBtn = new IconButton(this, {
            x: 680, y: 50, size: 40, color: 0x333333, icon: '⏸', iconSize: '18px',
            callback: () => this.pauseGame()
        });
        this.uiContainer.add(this.pauseBtn.container);

        this.powerupIndicators = {};
    }

    createObstacles() {
        this.obstacles = this.physics.add.group({ runChildUpdate: false });
        this.obstacleTimer = null;
    }

    createCollectibles() {
        this.coins_group = this.physics.add.group({ runChildUpdate: false });
        this.gems_group = this.physics.add.group({ runChildUpdate: false });
        this.coinTimer = null;
    }

    createEnemies() {
        this.enemies = this.physics.add.group({ runChildUpdate: false });
        this.enemyTimer = null;
    }

    createPowerups() {
        this.powerups = this.physics.add.group({ runChildUpdate: false });
        this.powerupTimer = null;
    }

    setupInput() {
        this.input.on('pointerdown', (pointer) => {
            if (this.gameState === CONSTANTS.STATES.DEAD) return;
            const y = pointer.y;
            if (y > this.cameras.main.height * 0.6) {
                this.slide();
            } else {
                this.jump();
            }
        });

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.spaceKey.on('down', () => this.jump());
        this.upKey.on('down', () => this.jump());
        this.downKey.on('down', () => this.slide());
        this.escKey.on('down', () => this.pauseGame());
    }

    setupCollisions() {
        this.physics.add.collider(this.player, this.groundBody, () => {
            if (this.playerState === CONSTANTS.STATES.JUMPING ||
                this.playerState === CONSTANTS.STATES.DOUBLE_JUMPING ||
                this.playerState === CONSTANTS.STATES.FALLING) {
                this.playerLanded();
            }
        });

        this.physics.add.overlap(this.player, this.obstacles, (player, obstacle) => {
            this.hitObstacle(obstacle);
        });

        this.physics.add.overlap(this.player, this.coins_group, (player, coin) => {
            this.collectCoin(coin);
        });

        this.physics.add.overlap(this.player, this.gems_group, (player, gem) => {
            this.collectGem(gem);
        });

        this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
            this.hitEnemy(enemy);
        });

        this.physics.add.overlap(this.player, this.powerups, (player, powerup) => {
            this.collectPowerup(powerup);
        });
    }

    startSpawning() {
        this.obstacleTimer = this.time.addEvent({
            delay: Phaser.Math.Between(GAME_CONFIG.SPAWNING.OBSTACLE_INTERVAL.min, GAME_CONFIG.SPAWNING.OBSTACLE_INTERVAL.max),
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });

        this.coinTimer = this.time.addEvent({
            delay: Phaser.Math.Between(GAME_CONFIG.SPAWNING.COIN_INTERVAL.min, GAME_CONFIG.SPAWNING.COIN_INTERVAL.max),
            callback: this.spawnCoins,
            callbackScope: this,
            loop: true
        });

        this.enemyTimer = this.time.addEvent({
            delay: Phaser.Math.Between(GAME_CONFIG.SPAWNING.ENEMY_INTERVAL.min, GAME_CONFIG.SPAWNING.ENEMY_INTERVAL.max),
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        this.powerupTimer = this.time.addEvent({
            delay: Phaser.Math.Between(GAME_CONFIG.SPAWNING.POWERUP_INTERVAL.min, GAME_CONFIG.SPAWNING.POWERUP_INTERVAL.max),
            callback: this.spawnPowerup,
            callbackScope: this,
            loop: true
        });
    }

    startGame() {
        this.gameState = CONSTANTS.STATES.RUNNING;
        this.playerState = CONSTANTS.STATES.RUNNING;
        playerProgression.addRun();
    }

    update(time, delta) {
        if (this.gameState !== CONSTANTS.STATES.RUNNING) return;

        this.updateScroll(delta);
        this.updatePlayer(delta);
        this.updateDistance(delta);
        this.updateScore(delta);
        this.updatePowerups(delta);
        this.cleanupOffscreen();
        this.checkAchievements();
    }

    updateScroll(delta) {
        const scrollAmount = this.scrollSpeed * (delta / 1000);
        this.ground.tilePositionX += scrollAmount;

        this.bgLayers.forEach(layer => {
            if (layer.graphic && layer.graphic.tilePositionX !== undefined) {
                layer.graphic.tilePositionX += scrollAmount * layer.speed;
            }
        });

        this.obstacles.getChildren().forEach(obs => {
            if (obs.active) obs.x -= scrollAmount;
        });
        this.coins_group.getChildren().forEach(coin => {
            if (coin.active) coin.x -= scrollAmount;
        });
        this.gems_group.getChildren().forEach(gem => {
            if (gem.active) gem.x -= scrollAmount;
        });
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.active) enemy.x -= scrollAmount * (enemy.getData('speedMult') || 1);
        });
        this.powerups.getChildren().forEach(pu => {
            if (pu.active) pu.x -= scrollAmount;
        });

        this.scrollSpeed = Math.min(
            GAME_CONFIG.SCROLL.MAX_SPEED,
            this.scrollSpeed + GAME_CONFIG.SCROLL.SPEED_INCREMENT * (delta / 1000)
        );
    }

    updatePlayer(delta) {
        if (this.player.body.touching.down || this.player.body.blocked.down) {
            this.playerState = CONSTANTS.STATES.RUNNING;
            this.jumpCount = 0;
        }

        if (this.player.y >= GAME_CONFIG.SCROLL.GROUND_Y - 50) {
            this.player.y = GAME_CONFIG.SCROLL.GROUND_Y - 50;
            this.player.body.setVelocityY(0);
        }
    }

    updateDistance(delta) {
        this.distance += (this.scrollSpeed * delta / 1000) * 0.1;
        this.distanceText.setText(`${Math.floor(this.distance)}m`);
    }

    updateScore(delta) {
        this.score += Math.floor(this.scrollSpeed * (delta / 1000) * GAME_CONFIG.SCORING.DISTANCE_MULTIPLIER);
        this.scoreText.setText(Helpers.formatNumber(this.score));
    }

    updatePowerups(delta) {
        Object.keys(this.activePowerups).forEach(key => {
            this.activePowerups[key] -= delta;
            if (this.activePowerups[key] <= 0) {
                this.deactivatePowerup(key);
            }
        });
    }

    jump() {
        if (this.gameState !== CONSTANTS.STATES.RUNNING) return;

        const onGround = this.player.body.touching.down || this.player.body.blocked.down;

        if (onGround) {
            this.player.body.setVelocityY(GAME_CONFIG.PHYSICS.JUMP_FORCE);
            this.playerState = CONSTANTS.STATES.JUMPING;
            this.jumpCount = 1;
            this.createJumpEffect();
            audioManager.playJumpSound();
        } else if (this.jumpCount < 2) {
            this.player.body.setVelocityY(GAME_CONFIG.PHYSICS.DOUBLE_JUMP_FORCE);
            this.playerState = CONSTANTS.STATES.DOUBLE_JUMPING;
            this.jumpCount = 2;
            this.createDoubleJumpEffect();
            audioManager.playJumpSound();
        }

        eventManager.emit(CONSTANTS.EVENTS.PLAYER_JUMP);
    }

    slide() {
        if (this.gameState !== CONSTANTS.STATES.RUNNING) return;
        if (this.playerState === CONSTANTS.STATES.SLIDING) return;

        const onGround = this.player.body.touching.down || this.player.body.blocked.down;
        if (!onGround) return;

        this.playerState = CONSTANTS.STATES.SLIDING;
        this.player.body.setSize(48, 40);
        this.player.body.setOffset(8, 56);
        this.player.setTint(0x888888);

        this.time.delayedCall(600, () => {
            if (this.playerState === CONSTANTS.STATES.SLIDING) {
                this.playerState = CONSTANTS.STATES.RUNNING;
                this.player.body.setSize(48, 80);
                this.player.body.setOffset(8, 8);
                this.player.clearTint();
            }
        });

        audioManager.playSlideSound();
        eventManager.emit(CONSTANTS.EVENTS.PLAYER_SLIDE);
    }

    playerLanded() {
        this.jumpCount = 0;
        this.createLandingEffect();
    }

    spawnObstacle() {
        if (this.gameState !== CONSTANTS.STATES.RUNNING) return;

        const types = Object.values(OBSTACLE_TYPES);
        const type = Phaser.Math.RND.pick(types);
        const x = this.cameras.main.width + 100;
        const y = type.ground ? GAME_CONFIG.SCROLL.GROUND_Y - type.height / 2 : GAME_CONFIG.SCROLL.GROUND_Y - 200;

        const obstacle = this.physics.add.sprite(x, y, type.key);
        obstacle.setDepth(GAME_CONFIG.LAYERS.OBSTACLES);
        obstacle.body.setImmovable(true);
        obstacle.body.setAllowGravity(false);
        obstacle.setData('type', type);
        obstacle.body.setSize(type.width * 0.8, type.height * 0.8);

        this.obstacles.add(obstacle);

        this.obstacleTimer.delay = Phaser.Math.Between(
            GAME_CONFIG.SPAWNING.OBSTACLE_INTERVAL.min,
            GAME_CONFIG.SPAWNING.OBSTACLE_INTERVAL.max
        );
    }

    spawnCoins() {
        if (this.gameState !== CONSTANTS.STATES.RUNNING) return;

        const x = this.cameras.main.width + 50;
        const patterns = ['line', 'arc', 'random'];
        const pattern = Phaser.Math.RND.pick(patterns);

        switch (pattern) {
            case 'line':
                for (let i = 0; i < 5; i++) {
                    this.createCoin(x + i * 40, GAME_CONFIG.SCROLL.GROUND_Y - 100);
                }
                break;
            case 'arc':
                for (let i = 0; i < 5; i++) {
                    const arcY = GAME_CONFIG.SCROLL.GROUND_Y - 100 - Math.sin(i / 4 * Math.PI) * 100;
                    this.createCoin(x + i * 40, arcY);
                }
                break;
            case 'random':
                for (let i = 0; i < 3; i++) {
                    this.createCoin(x + Phaser.Math.Between(0, 100), Phaser.Math.Between(400, GAME_CONFIG.SCROLL.GROUND_Y - 50));
                }
                break;
        }

        this.coinTimer.delay = Phaser.Math.Between(
            GAME_CONFIG.SPAWNING.COIN_INTERVAL.min,
            GAME_CONFIG.SPAWNING.COIN_INTERVAL.max
        );
    }

    createCoin(x, y) {
        const coin = this.physics.add.sprite(x, y, 'coin');
        coin.setDepth(GAME_CONFIG.LAYERS.COLLECTIBLES);
        coin.body.setAllowGravity(false);
        coin.body.setCircle(15);
        this.coins_group.add(coin);

        this.tweens.add({
            targets: coin, scaleX: 1.2, scaleY: 1.2,
            duration: 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });
    }

    spawnEnemy() {
        if (this.gameState !== CONSTANTS.STATES.RUNNING) return;

        const types = Object.values(ENEMY_TYPES);
        const type = Phaser.Math.RND.pick(types);
        const x = this.cameras.main.width + 100;
        const y = type.ground ? GAME_CONFIG.SCROLL.GROUND_Y - type.height / 2 : GAME_CONFIG.SCROLL.GROUND_Y - type.flyHeight;

        const enemy = this.physics.add.sprite(x, y, type.key);
        enemy.setDepth(GAME_CONFIG.LAYERS.ENEMIES);
        enemy.body.setAllowGravity(false);
        enemy.setData('health', type.health);
        enemy.setData('type', type);
        enemy.setData('speedMult', type.speed);
        enemy.body.setSize(type.width * 0.8, type.height * 0.8);

        this.enemies.add(enemy);

        if (!type.ground) {
            this.tweens.add({
                targets: enemy, y: y - 30, duration: 1000,
                yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
            });
        }

        this.enemyTimer.delay = Phaser.Math.Between(
            GAME_CONFIG.SPAWNING.ENEMY_INTERVAL.min,
            GAME_CONFIG.SPAWNING.ENEMY_INTERVAL.max
        );
    }

    spawnPowerup() {
        if (this.gameState !== CONSTANTS.STATES.RUNNING) return;

        const types = Object.values(POWERUP_TYPES);
        const type = Phaser.Math.RND.pick(types);
        const x = this.cameras.main.width + 50;
        const y = Phaser.Math.Between(400, GAME_CONFIG.SCROLL.GROUND_Y - 150);

        const powerup = this.physics.add.sprite(x, y, type.key);
        powerup.setDepth(GAME_CONFIG.LAYERS.COLLECTIBLES);
        powerup.body.setAllowGravity(false);
        powerup.setData('type', type);
        this.powerups.add(powerup);

        this.tweens.add({
            targets: powerup, y: y - 20, alpha: 0.7,
            duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });

        this.powerupTimer.delay = Phaser.Math.Between(
            GAME_CONFIG.SPAWNING.POWERUP_INTERVAL.min,
            GAME_CONFIG.SPAWNING.POWERUP_INTERVAL.max
        );
    }

    collectCoin(coin) {
        if (!coin.active) return;
        this.coins_group.killAndHide(coin);
        coin.body.enable = false;

        this.coins++;
        this.coinText.setText(this.coins.toString());

        const coinValue = this.activePowerups.double_coins ? GAME_CONFIG.SCORING.COIN_VALUE * 2 : GAME_CONFIG.SCORING.COIN_VALUE;
        this.score += coinValue;

        this.incrementCombo();
        this.runXP += playerProgression.getXPFromCoin();

        this.createCoinCollectEffect(coin.x, coin.y);
        audioManager.playCoinSound();
        eventManager.emit(CONSTANTS.EVENTS.COIN_COLLECTED, { coins: this.coins, value: coinValue });
    }

    collectGem(gem) {
        if (!gem.active) return;
        this.gems_group.killAndHide(gem);
        gem.body.enable = false;

        this.gems++;
        this.gemText.setText(this.gems.toString());
        this.score += GAME_CONFIG.SCORING.GEM_VALUE;

        this.incrementCombo();
        this.createGemCollectEffect(gem.x, gem.y);
        audioManager.playGemSound();
        eventManager.emit(CONSTANTS.EVENTS.GEM_COLLECTED, { gems: this.gems });
    }

    hitObstacle(obstacle) {
        if (this.isInvincible || this.gameState === CONSTANTS.STATES.DEAD) return;

        if (this.activePowerups.shield) {
            this.deactivatePowerup('shield');
            this.createShieldBreakEffect();
            obstacle.destroy();
            return;
        }

        this.gameOver();
    }

    hitEnemy(enemy) {
        if (this.gameState === CONSTANTS.STATES.DEAD) return;

        const playerFalling = this.player.body.velocity.y > 0 && this.player.y < enemy.y;
        const type = enemy.getData('type');

        if (playerFalling && type.ground) {
            let health = enemy.getData('health') - 1;
            enemy.setData('health', health);

            this.player.body.setVelocityY(GAME_CONFIG.PHYSICS.JUMP_FORCE * 0.6);
            this.createEnemyHitEffect(enemy.x, enemy.y);

            if (health <= 0) {
                this.enemies.killAndHide(enemy);
                enemy.body.enable = false;
                this.enemiesDefeated++;
                this.score += 100;
                this.runXP += playerProgression.getXPFromEnemy();
                this.incrementCombo();
                audioManager.playEnemyDefeatSound();
                eventManager.emit(CONSTANTS.EVENTS.ENEMY_DEFEATED);
            }
        } else if (this.isInvincible) {
            return;
        } else if (this.activePowerups.shield) {
            this.deactivatePowerup('shield');
            this.createShieldBreakEffect();
        } else {
            this.gameOver();
        }
    }

    collectPowerup(powerup) {
        if (!powerup.active) return;
        const type = powerup.getData('type');
        this.powerups.killAndHide(powerup);
        powerup.body.enable = false;

        this.activatePowerup(type);
        this.createPowerupCollectEffect(powerup.x, powerup.y, type.color);
        audioManager.playPowerupSound();
    }

    activatePowerup(type) {
        this.activePowerups[type.key] = type.duration;
        this.showPowerupIndicator(type);
        eventManager.emit(CONSTANTS.EVENTS.POWERUP_COLLECTED, { type });

        if (type.key === 'shield') {
            this.createShieldEffect();
        }
    }

    deactivatePowerup(key) {
        delete this.activePowerups[key];
        this.hidePowerupIndicator(key);

        if (key === 'shield') {
            this.removeShieldEffect();
        }
    }

    showPowerupIndicator(type) {
        const y = 100 + Object.keys(this.activePowerups).length * 35;
        const bg = this.add.graphics();
        bg.fillStyle(type.color, 0.3);
        bg.fillRoundedRect(20, y, 150, 30, 15);
        bg.setDepth(GAME_CONFIG.LAYERS.UI);

        const text = this.add.text(95, y + 15, `${type.icon} ${type.key.toUpperCase()}`, {
            fontFamily: 'Poppins', fontSize: '12px', fontStyle: 'bold', color: '#FFFFFF'
        }).setOrigin(0.5).setDepth(GAME_CONFIG.LAYERS.UI);

        this.powerupIndicators[type.key] = { bg, text };
    }

    hidePowerupIndicator(key) {
        if (this.powerupIndicators[key]) {
            this.powerupIndicators[key].bg.destroy();
            this.powerupIndicators[key].text.destroy();
            delete this.powerupIndicators[key];
        }
    }

    incrementCombo() {
        this.combo++;
        this.comboText.setText(`${this.combo}x COMBO`);
        this.comboText.setAlpha(1);

        this.tweens.add({
            targets: this.comboText, scaleX: 1.3, scaleY: 1.3,
            duration: 100, yoyo: true, ease: 'Power2'
        });

        if (this.comboTimer) this.comboTimer.remove();
        this.comboTimer = this.time.addEvent({
            delay: GAME_CONFIG.SCORING.COMBO_TIMEOUT,
            callback: () => { this.combo = 0; this.comboText.setAlpha(0); },
            callbackScope: this
        });

        this.score += Math.floor(this.combo * GAME_CONFIG.SCORING.COMBO_MULTIPLIER * 10);
        playerProgression.updateCombo(this.combo);
    }

    gameOver() {
        this.gameState = CONSTANTS.STATES.DEAD;
        this.playerState = CONSTANTS.STATES.DEAD;

        this.player.setTint(0xFF0000);
        this.player.body.setVelocityY(-300);

        this.cameras.main.shake(300, 0.01);
        this.createDeathEffect();
        audioManager.playDeathSound();

        this.saveRunData();

        this.time.delayedCall(1500, () => {
            this.scene.start(CONSTANTS.SCENES.GAME_OVER, {
                score: this.score,
                distance: Math.floor(this.distance),
                coins: this.coins,
                gems: this.gems,
                combo: this.combo,
                enemies: this.enemiesDefeated
            });
        });

        eventManager.emit(CONSTANTS.EVENTS.GAME_OVER);
    }

    saveRunData() {
        playerProgression.addScore(this.score);
        playerProgression.addDistance(this.distance);
        playerProgression.addXP(Math.floor(this.runXP));

        const player = saveManager.getPlayerData();
        saveManager.savePlayerData({
            coins: player.coins + this.coins,
            totalCoins: player.totalCoins + this.coins,
            totalGems: player.totalGems + this.gems
        });

        if (this.enemiesDefeated > 0) {
            for (let i = 0; i < this.enemiesDefeated; i++) {
                playerProgression.addEnemyKill();
            }
        }

        achievementManager.checkAchievements(playerProgression.getStats());
        missionManager.updateProgress('distance', Math.floor(this.distance));
        missionManager.updateProgress('coins', this.coins);
        missionManager.updateProgress('enemies', this.enemiesDefeated);
        missionManager.updateProgress('score', this.score);
        missionManager.updateProgress('combo', this.combo);
    }

    pauseGame() {
        if (this.gameState === CONSTANTS.STATES.DEAD) return;
        this.scene.launch(CONSTANTS.SCENES.PAUSE);
        this.scene.pause();
    }

    cleanupOffscreen() {
        const minX = -100;
        const cleanup = (group) => {
            group.getChildren().forEach(child => {
                if (child.active && child.x < minX) {
                    group.killAndHide(child);
                    child.body.enable = false;
                }
            });
        };
        cleanup(this.obstacles);
        cleanup(this.coins_group);
        cleanup(this.gems_group);
        cleanup(this.enemies);
        cleanup(this.powerups);
    }

    checkAchievements() {
        if (this.score >= 10000 && !this.ach10k) {
            this.ach10k = true;
            notificationManager.achievement('High Scorer!', 'Scored 10,000 points!');
        }
    }

    createJumpEffect() {
        for (let i = 0; i < 5; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(0xFFFFFF, 0.6);
            particle.fillCircle(0, 0, Phaser.Math.Between(2, 5));
            particle.setPosition(this.player.x + Phaser.Math.Between(-20, 20), this.player.y + 40);
            particle.setDepth(GAME_CONFIG.LAYERS.EFFECTS);

            this.tweens.add({
                targets: particle, y: particle.y + 30, alpha: 0,
                duration: 400, onComplete: () => particle.destroy()
            });
        }
    }

    createDoubleJumpEffect() {
        for (let i = 0; i < 8; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(0x00E5FF, 0.8);
            particle.fillCircle(0, 0, Phaser.Math.Between(2, 4));
            particle.setPosition(this.player.x + Phaser.Math.Between(-30, 30), this.player.y + 20);
            particle.setDepth(GAME_CONFIG.LAYERS.EFFECTS);

            this.tweens.add({
                targets: particle,
                x: particle.x + Phaser.Math.Between(-40, 40),
                y: particle.y + Phaser.Math.Between(20, 50),
                alpha: 0, duration: 500,
                onComplete: () => particle.destroy()
            });
        }
    }

    createLandingEffect() {
        for (let i = 0; i < 8; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(0x8B4513, 0.6);
            particle.fillCircle(0, 0, Phaser.Math.Between(2, 5));
            particle.setPosition(this.player.x + Phaser.Math.Between(-30, 30), GAME_CONFIG.SCROLL.GROUND_Y - 10);
            particle.setDepth(GAME_CONFIG.LAYERS.EFFECTS);

            this.tweens.add({
                targets: particle,
                x: particle.x + Phaser.Math.Between(-50, 50),
                y: particle.y + Phaser.Math.Between(-10, 10),
                alpha: 0, duration: 400,
                onComplete: () => particle.destroy()
            });
        }
    }

    createCoinCollectEffect(x, y) {
        for (let i = 0; i < 6; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(0xFFD700, 0.8);
            particle.fillCircle(0, 0, Phaser.Math.Between(2, 4));
            particle.setPosition(x, y);
            particle.setDepth(GAME_CONFIG.LAYERS.EFFECTS);

            this.tweens.add({
                targets: particle,
                x: x + Phaser.Math.Between(-40, 40),
                y: y + Phaser.Math.Between(-50, -20),
                alpha: 0, duration: 500,
                onComplete: () => particle.destroy()
            });
        }
    }

    createGemCollectEffect(x, y) {
        for (let i = 0; i < 8; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(0x00E5FF, 0.8);
            particle.fillCircle(0, 0, Phaser.Math.Between(2, 5));
            particle.setPosition(x, y);
            particle.setDepth(GAME_CONFIG.LAYERS.EFFECTS);

            this.tweens.add({
                targets: particle,
                x: x + Phaser.Math.Between(-50, 50),
                y: y + Phaser.Math.Between(-60, -20),
                alpha: 0, duration: 600,
                onComplete: () => particle.destroy()
            });
        }
    }

    createEnemyHitEffect(x, y) {
        for (let i = 0; i < 10; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(0xF44336, 0.8);
            particle.fillCircle(0, 0, Phaser.Math.Between(3, 6));
            particle.setPosition(x, y);
            particle.setDepth(GAME_CONFIG.LAYERS.EFFECTS);

            this.tweens.add({
                targets: particle,
                x: x + Phaser.Math.Between(-60, 60),
                y: y + Phaser.Math.Between(-60, 60),
                alpha: 0, duration: 500,
                onComplete: () => particle.destroy()
            });
        }
    }

    createPowerupCollectEffect(x, y, color) {
        for (let i = 0; i < 12; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(color, 0.8);
            particle.fillCircle(0, 0, Phaser.Math.Between(3, 6));
            particle.setPosition(x, y);
            particle.setDepth(GAME_CONFIG.LAYERS.EFFECTS);

            this.tweens.add({
                targets: particle,
                x: x + Math.cos(i / 12 * Math.PI * 2) * 60,
                y: y + Math.sin(i / 12 * Math.PI * 2) * 60,
                alpha: 0, duration: 600,
                onComplete: () => particle.destroy()
            });
        }
    }

    createShieldEffect() {
        this.shieldGraphic = this.add.graphics();
        this.shieldGraphic.setDepth(GAME_CONFIG.LAYERS.EFFECTS);
        this.updateShieldPosition();
    }

    updateShieldPosition() {
        if (!this.shieldGraphic || !this.shieldGraphic.active) return;
        this.shieldGraphic.clear();
        this.shieldGraphic.lineStyle(3, 0x4CAF50, 0.6);
        this.shieldGraphic.strokeCircle(this.player.x, this.player.y, 50);
    }

    removeShieldEffect() {
        if (this.shieldGraphic) {
            this.shieldGraphic.destroy();
            this.shieldGraphic = null;
        }
    }

    createShieldBreakEffect() {
        for (let i = 0; i < 15; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(0x4CAF50, 0.8);
            particle.fillCircle(0, 0, Phaser.Math.Between(3, 6));
            particle.setPosition(this.player.x, this.player.y);
            particle.setDepth(GAME_CONFIG.LAYERS.EFFECTS);

            this.tweens.add({
                targets: particle,
                x: this.player.x + Math.cos(i / 15 * Math.PI * 2) * 70,
                y: this.player.y + Math.sin(i / 15 * Math.PI * 2) * 70,
                alpha: 0, duration: 500,
                onComplete: () => particle.destroy()
            });
        }
    }

    createDeathEffect() {
        for (let i = 0; i < 20; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(Phaser.Math.RND.pick([0xF44336, 0xFF6B6B, 0xFFFFFF]), 0.8);
            particle.fillCircle(0, 0, Phaser.Math.Between(3, 8));
            particle.setPosition(this.player.x, this.player.y);
            particle.setDepth(GAME_CONFIG.LAYERS.EFFECTS);

            this.tweens.add({
                targets: particle,
                x: this.player.x + Phaser.Math.Between(-100, 100),
                y: this.player.y + Phaser.Math.Between(-100, 100),
                alpha: 0, duration: 800,
                onComplete: () => particle.destroy()
            });
        }
    }
}
