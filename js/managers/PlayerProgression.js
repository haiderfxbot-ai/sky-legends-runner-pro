class PlayerProgression {
    constructor() {
        this.playerData = saveManager.getPlayerData();
    }

    loadData() {
        this.playerData = saveManager.getPlayerData();
    }

    getLevel() {
        this.loadData();
        return this.playerData.level || 1;
    }

    getXP() {
        this.loadData();
        return this.playerData.xp || 0;
    }

    getXPForCurrentLevel() {
        return this.getXPForLevel(this.getLevel());
    }

    getXPForLevel(level) {
        return Math.floor(GAME_CONFIG.PROGRESSION.XP_PER_LEVEL * Math.pow(GAME_CONFIG.PROGRESSION.XP_GROWTH, level - 1));
    }

    getXPProgress() {
        const currentXP = this.getXP();
        const requiredXP = this.getXPForCurrentLevel();
        return Math.min(100, (currentXP / requiredXP) * 100);
    }

    addXP(amount) {
        this.loadData();
        
        let xp = (this.playerData.xp || 0) + amount;
        let level = this.playerData.level || 1;
        let leveledUp = false;

        while (xp >= this.getXPForLevel(level) && level < GAME_CONFIG.PROGRESSION.MAX_LEVEL) {
            xp -= this.getXPForLevel(level);
            level++;
            leveledUp = true;
            
            this.onLevelUp(level);
        }

        this.playerData.xp = xp;
        this.playerData.level = level;
        saveManager.savePlayerData(this.playerData);

        eventManager.emit(CONSTANTS.EVENTS.XP_UPDATE, {
            xp: this.playerData.xp,
            level: this.playerData.level,
            amount,
            leveledUp
        });

        return { leveledUp, newLevel: level };
    }

    onLevelUp(newLevel) {
        eventManager.emit(CONSTANTS.EVENTS.LEVEL_UP, {
            level: newLevel,
            rewards: this.getLevelRewards(newLevel)
        });

        const rewards = this.getLevelRewards(newLevel);
        if (rewards.coins > 0) saveManager.addCoins(rewards.coins);
        if (rewards.gems > 0) saveManager.addGems(rewards.gems);

        notificationManager.success(
            'Level Up!',
            `You reached level ${newLevel}!`
        );

        audioManager.playLevelUpSound();
    }

    getLevelRewards(level) {
        const rewards = {
            coins: 50 + (level * 10),
            gems: level % 5 === 0 ? 5 : 0
        };
        return rewards;
    }

    getXPFromDistance(distance) {
        return Math.floor(distance * GAME_CONFIG.PROGRESSION.XP_PER_DISTANCE);
    }

    getXPFromCoin() {
        return GAME_CONFIG.PROGRESSION.XP_PER_COIN;
    }

    getXPFromEnemy() {
        return GAME_CONFIG.PROGRESSION.XP_PER_ENEMY;
    }

    getXPFromBoss() {
        return GAME_CONFIG.PROGRESSION.XP_PER_BOSS;
    }

    getTotalDistance() {
        this.loadData();
        return this.playerData.totalDistance || 0;
    }

    addDistance(distance) {
        this.loadData();
        this.playerData.totalDistance = (this.playerData.totalDistance || 0) + distance;
        
        if (distance > (this.playerData.bestDistance || 0)) {
            this.playerData.bestDistance = distance;
        }
        
        saveManager.savePlayerData(this.playerData);
    }

    addScore(score) {
        this.loadData();
        this.playerData.totalScore = (this.playerData.totalScore || 0) + score;
        
        if (score > (this.playerData.highScore || 0)) {
            this.playerData.highScore = score;
        }
        
        saveManager.savePlayerData(this.playerData);
    }

    addRun() {
        this.loadData();
        this.playerData.totalRuns = (this.playerData.totalRuns || 0) + 1;
        saveManager.savePlayerData(this.playerData);
    }

    addEnemyKill() {
        this.loadData();
        this.playerData.totalEnemies = (this.playerData.totalEnemies || 0) + 1;
        saveManager.savePlayerData(this.playerData);
    }

    addBossKill() {
        this.loadData();
        this.playerData.totalBosses = (this.playerData.totalBosses || 0) + 1;
        saveManager.savePlayerData(this.playerData);
    }

    updateCombo(combo) {
        this.loadData();
        if (combo > (this.playerData.bestCombo || 0)) {
            this.playerData.bestCombo = combo;
            saveManager.savePlayerData(this.playerData);
        }
    }

    getStats() {
        this.loadData();
        return {
            level: this.playerData.level || 1,
            xp: this.playerData.xp || 0,
            highScore: this.playerData.highScore || 0,
            bestDistance: this.playerData.bestDistance || 0,
            totalDistance: this.playerData.totalDistance || 0,
            totalCoins: this.playerData.totalCoins || 0,
            totalGems: this.playerData.totalGems || 0,
            totalEnemies: this.playerData.totalEnemies || 0,
            totalBosses: this.playerData.totalBosses || 0,
            totalRuns: this.playerData.totalRuns || 0,
            bestCombo: this.playerData.bestCombo || 0
        };
    }

    getLeaderboardData() {
        return {
            highScore: this.playerData.highScore || 0,
            bestDistance: this.playerData.bestDistance || 0,
            level: this.playerData.level || 1
        };
    }

    resetProgress() {
        this.playerData = {
            ...saveManager.getDefaultData().player
        };
        saveManager.savePlayerData(this.playerData);
    }
}

const playerProgression = new PlayerProgression();
