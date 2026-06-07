class DailyRewardManager {
    constructor() {
        this.rewards = DAILY_REWARDS;
        this.dailyData = saveManager.getDaily();
    }

    loadData() {
        this.dailyData = saveManager.getDaily();
    }

    saveData() {
        saveManager.saveDaily(this.dailyData);
    }

    canClaimReward() {
        this.loadData();
        
        if (!this.dailyData.lastLogin) return true;
        
        return !Helpers.isToday(this.dailyData.lastLogin);
    }

    getLoginStreak() {
        this.loadData();
        return this.dailyData.loginStreak || 0;
    }

    getLastRewardDay() {
        this.loadData();
        return this.dailyData.lastRewardClaimed || 0;
    }

    getNextReward() {
        const streak = this.getLoginStreak();
        const nextDay = (streak % 7) + 1;
        return this.rewards.find(r => r.day === nextDay);
    }

    getAvailableRewards() {
        const streak = this.getLoginStreak();
        const nextDay = (streak % 7) + 1;
        
        return this.rewards.map(reward => ({
            ...reward,
            isNext: reward.day === nextDay,
            claimed: reward.day <= (streak % 7)
        }));
    }

    claimReward() {
        if (!this.canClaimReward()) {
            return { success: false, message: 'Already claimed today' };
        }

        this.loadData();
        
        const streak = this.dailyData.loginStreak || 0;
        const nextDay = (streak % 7) + 1;
        const reward = this.rewards.find(r => r.day === nextDay);
        
        if (!reward) {
            return { success: false, message: 'Invalid reward day' };
        }

        this.dailyData.lastLogin = new Date().toDateString();
        this.dailyData.loginStreak = streak + 1;
        this.dailyData.lastRewardClaimed = nextDay;
        
        if (reward.coins > 0) {
            saveManager.addCoins(reward.coins);
        }
        if (reward.gems > 0) {
            saveManager.addGems(reward.gems);
        }

        this.saveData();

        eventManager.emit(CONSTANTS.EVENTS.DAILY_REWARD, {
            day: nextDay,
            reward
        });

        return {
            success: true,
            reward,
            streak: this.dailyData.loginStreak,
            message: `Day ${nextDay} reward claimed!`
        };
    }

    getTimeUntilNextReward() {
        if (this.canClaimReward()) return 'Available now';
        
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const diff = tomorrow - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    isStreakBonus() {
        const streak = this.getLoginStreak();
        return streak > 0 && streak % 7 === 0;
    }

    getBonusReward() {
        if (!this.isStreakBonus()) return null;
        
        const streak = this.getLoginStreak();
        const bonusMultiplier = Math.floor(streak / 7);
        
        return {
            coins: 500 * bonusMultiplier,
            gems: 50 * bonusMultiplier,
            message: `7-day streak bonus! x${bonusMultiplier}`
        };
    }

    reset() {
        this.dailyData = {
            lastLogin: null,
            loginStreak: 0,
            lastRewardClaimed: 0
        };
        this.saveData();
    }
}

const dailyRewardManager = new DailyRewardManager();
