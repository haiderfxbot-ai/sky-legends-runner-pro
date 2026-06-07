class AchievementManager {
    constructor() {
        this.achievements = ACHIEVEMENTS;
        this.unlocked = {};
        this.loadUnlocked();
    }

    loadUnlocked() {
        this.unlocked = saveManager.getAchievements();
    }

    saveUnlocked() {
        saveManager.saveAchievements(this.unlocked);
    }

    isUnlocked(achievementId) {
        return this.unlocked[achievementId] === true;
    }

    getUnlockedCount() {
        return Object.keys(this.unlocked).length;
    }

    getTotalCount() {
        return this.achievements.length;
    }

    getProgress() {
        return (this.getUnlockedCount() / this.getTotalCount()) * 100;
    }

    getAchievement(achievementId) {
        return this.achievements.find(a => a.id === achievementId);
    }

    getAllAchievements() {
        return this.achievements.map(a => ({
            ...a,
            unlocked: this.isUnlocked(a.id)
        }));
    }

    getUnlockedAchievements() {
        return this.achievements.filter(a => this.isUnlocked(a.id));
    }

    getLockedAchievements() {
        return this.achievements.filter(a => !this.isUnlocked(a.id));
    }

    checkAchievements(stats) {
        const newAchievements = [];

        this.achievements.forEach(achievement => {
            if (this.isUnlocked(achievement.id)) return;

            if (this.checkCondition(achievement.condition, stats)) {
                this.unlock(achievement);
                newAchievements.push(achievement);
            }
        });

        return newAchievements;
    }

    checkCondition(condition, stats) {
        switch (condition.type) {
            case 'runs':
                return stats.totalRuns >= condition.value;
            case 'distance':
                return stats.bestDistance >= condition.value;
            case 'total_coins':
                return stats.totalCoins >= condition.value;
            case 'score':
                return stats.highScore >= condition.value;
            case 'enemies':
                return stats.totalEnemies >= condition.value;
            case 'bosses':
                return stats.totalBosses >= condition.value;
            case 'combo':
                return stats.bestCombo >= condition.value;
            case 'level':
                return stats.level >= condition.value;
            default:
                return false;
        }
    }

    unlock(achievement) {
        if (this.isUnlocked(achievement.id)) return false;

        this.unlocked[achievement.id] = true;
        this.saveUnlocked();

        saveManager.addCoins(achievement.reward);

        eventManager.emit(CONSTANTS.EVENTS.ACHIEVEMENT_UNLOCK, achievement);

        notificationManager.achievement(
            'Achievement Unlocked!',
            `${achievement.name} - ${achievement.description}`
        );

        return true;
    }

    getRecentAchievements(count = 5) {
        return this.getUnlockedAchievements().slice(-count);
    }

    getAchievementWithProgress(achievementId, stats) {
        const achievement = this.getAchievement(achievementId);
        if (!achievement) return null;

        const unlocked = this.isUnlocked(achievementId);
        let progress = 0;

        if (!unlocked) {
            switch (achievement.condition.type) {
                case 'runs':
                    progress = Math.min(100, (stats.totalRuns / achievement.condition.value) * 100);
                    break;
                case 'distance':
                    progress = Math.min(100, (stats.bestDistance / achievement.condition.value) * 100);
                    break;
                case 'total_coins':
                    progress = Math.min(100, (stats.totalCoins / achievement.condition.value) * 100);
                    break;
                case 'score':
                    progress = Math.min(100, (stats.highScore / achievement.condition.value) * 100);
                    break;
                case 'enemies':
                    progress = Math.min(100, (stats.totalEnemies / achievement.condition.value) * 100);
                    break;
                case 'bosses':
                    progress = Math.min(100, (stats.totalBosses / achievement.condition.value) * 100);
                    break;
                case 'combo':
                    progress = Math.min(100, (stats.bestCombo / achievement.condition.value) * 100);
                    break;
                case 'level':
                    progress = Math.min(100, (stats.level / achievement.condition.value) * 100);
                    break;
            }
        }

        return {
            ...achievement,
            unlocked,
            progress
        };
    }

    reset() {
        this.unlocked = {};
        this.saveUnlocked();
    }
}

const achievementManager = new AchievementManager();
