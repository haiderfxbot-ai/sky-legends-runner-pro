class SaveManager {
    constructor() {
        this.prefix = 'sky_legends_';
        this.defaultData = this.getDefaultData();
    }

    getDefaultData() {
        return {
            player: {
                name: 'Player',
                level: 1,
                xp: 0,
                coins: 500,
                gems: 25,
                totalDistance: 0,
                totalCoins: 0,
                totalGems: 0,
                totalEnemies: 0,
                totalBosses: 0,
                totalRuns: 0,
                highScore: 0,
                bestDistance: 0,
                bestCombo: 0,
                selectedCharacter: 'knight',
                selectedSkin: null
            },
            inventory: {
                characters: ['knight'],
                skins: [],
                boosters: {
                    revive: 0,
                    magnet_start: 0,
                    shield_start: 0,
                    double_coins_start: 0,
                    score_boost: 0
                }
            },
            achievements: {},
            missions: {
                daily: [],
                lastDailyReset: null
            },
            daily: {
                lastLogin: null,
                loginStreak: 0,
                lastRewardClaimed: 0
            },
            settings: {
                musicVolume: 0.7,
                sfxVolume: 1.0,
                musicEnabled: true,
                sfxEnabled: true,
                vibrations: true,
                notifications: true,
                quality: 'high'
            },
            stats: {
                totalPlayTime: 0,
                totalJumps: 0,
                totalSlides: 0,
                totalPowerups: 0,
                longestCombo: 0,
                totalScore: 0
            }
        };
    }

    load(key) {
        try {
            const data = localStorage.getItem(this.prefix + key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn('Failed to load data:', e);
            return null;
        }
    }

    save(key, data) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.warn('Failed to save data:', e);
            return false;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (e) {
            console.warn('Failed to remove data:', e);
            return false;
        }
    }

    clear() {
        try {
            Object.keys(localStorage)
                .filter(key => key.startsWith(this.prefix))
                .forEach(key => localStorage.removeItem(key));
            return true;
        } catch (e) {
            console.warn('Failed to clear data:', e);
            return false;
        }
    }

    getPlayerData() {
        return this.load('player_data') || this.defaultData.player;
    }

    savePlayerData(data) {
        const current = this.getPlayerData();
        const merged = { ...current, ...data };
        this.save('player_data', merged);
        return merged;
    }

    getInventory() {
        return this.load('inventory') || this.defaultData.inventory;
    }

    saveInventory(data) {
        const current = this.getInventory();
        const merged = { ...current, ...data };
        this.save('inventory', merged);
        return merged;
    }

    getSettings() {
        return this.load('settings') || this.defaultData.settings;
    }

    saveSettings(data) {
        const current = this.getSettings();
        const merged = { ...current, ...data };
        this.save('settings', merged);
        return merged;
    }

    getAchievements() {
        return this.load('achievements') || this.defaultData.achievements;
    }

    saveAchievements(data) {
        this.save('achievements', data);
    }

    getMissions() {
        return this.load('missions') || this.defaultData.missions;
    }

    saveMissions(data) {
        this.save('missions', data);
    }

    getDaily() {
        return this.load('daily') || this.defaultData.daily;
    }

    saveDaily(data) {
        this.save('daily', data);
    }

    getStats() {
        return this.load('stats') || this.defaultData.stats;
    }

    saveStats(data) {
        const current = this.getStats();
        const merged = { ...current, ...data };
        this.save('stats', merged);
        return merged;
    }

    updateStat(key, value) {
        const stats = this.getStats();
        if (typeof stats[key] === 'number') {
            stats[key] += value;
        } else {
            stats[key] = value;
        }
        this.saveStats(stats);
        return stats;
    }

    incrementPlayerStat(key, amount = 1) {
        const player = this.getPlayerData();
        if (typeof player[key] === 'number') {
            player[key] += amount;
        } else {
            player[key] = amount;
        }
        this.savePlayerData(player);
        return player;
    }

    setPlayerStat(key, value) {
        const player = this.getPlayerData();
        player[key] = value;
        this.savePlayerData(player);
        return player;
    }

    hasItem(inventoryKey, itemId) {
        const inventory = this.getInventory();
        if (Array.isArray(inventory[inventoryKey])) {
            return inventory[inventoryKey].includes(itemId);
        }
        return inventory[inventoryKey] && inventory[inventoryKey][itemId] > 0;
    }

    addItem(inventoryKey, itemId, quantity = 1) {
        const inventory = this.getInventory();
        if (Array.isArray(inventory[inventoryKey])) {
            if (!inventory[inventoryKey].includes(itemId)) {
                inventory[inventoryKey].push(itemId);
            }
        } else {
            inventory[inventoryKey][itemId] = (inventory[inventoryKey][itemId] || 0) + quantity;
        }
        this.saveInventory(inventory);
    }

    removeItem(inventoryKey, itemId, quantity = 1) {
        const inventory = this.getInventory();
        if (Array.isArray(inventory[inventoryKey])) {
            const index = inventory[inventoryKey].indexOf(itemId);
            if (index !== -1) {
                inventory[inventoryKey].splice(index, 1);
            }
        } else {
            inventory[inventoryKey][itemId] = Math.max(0, (inventory[inventoryKey][itemId] || 0) - quantity);
        }
        this.saveInventory(inventory);
    }

    addCoins(amount) {
        const player = this.getPlayerData();
        player.coins += amount;
        player.totalCoins += amount;
        this.savePlayerData(player);
        return player;
    }

    spendCoins(amount) {
        const player = this.getPlayerData();
        if (player.coins >= amount) {
            player.coins -= amount;
            this.savePlayerData(player);
            return true;
        }
        return false;
    }

    addGems(amount) {
        const player = this.getPlayerData();
        player.gems += amount;
        player.totalGems += amount;
        this.savePlayerData(player);
        return player;
    }

    spendGems(amount) {
        const player = this.getPlayerData();
        if (player.gems >= amount) {
            player.gems -= amount;
            this.savePlayerData(player);
            return true;
        }
        return false;
    }

    exportData() {
        const data = {};
        Object.keys(localStorage)
            .filter(key => key.startsWith(this.prefix))
            .forEach(key => {
                data[key] = JSON.parse(localStorage.getItem(key));
            });
        return JSON.stringify(data);
    }

    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            Object.entries(data).forEach(([key, value]) => {
                localStorage.setItem(key, JSON.stringify(value));
            });
            return true;
        } catch (e) {
            console.error('Failed to import data:', e);
            return false;
        }
    }
}

const saveManager = new SaveManager();
