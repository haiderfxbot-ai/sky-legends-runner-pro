class MissionManager {
    constructor() {
        this.dailyMissions = DAILY_MISSIONS;
        this.currentMissions = [];
        this.missionProgress = {};
        this.loadMissions();
    }

    loadMissions() {
        const saved = saveManager.getMissions();
        this.currentMissions = saved.daily || [];
        this.missionProgress = {};

        this.currentMissions.forEach(mission => {
            this.missionProgress[mission.id] = 0;
        });

        this.checkDailyReset();
    }

    saveMissions() {
        saveManager.saveMissions({
            daily: this.currentMissions,
            lastDailyReset: new Date().toDateString()
        });
    }

    checkDailyReset() {
        const saved = saveManager.getMissions();
        const lastReset = saved.lastDailyReset;
        
        if (!lastReset || !Helpers.isToday(lastReset)) {
            this.generateNewDailyMissions();
        }
    }

    generateNewDailyMissions() {
        const available = [...this.dailyMissions];
        this.currentMissions = [];
        
        const missionCount = Math.min(3, available.length);
        
        for (let i = 0; i < missionCount; i++) {
            const randomIndex = Helpers.randomInt(0, available.length - 1);
            const mission = available.splice(randomIndex, 1)[0];
            this.currentMissions.push({
                ...mission,
                progress: 0,
                completed: false,
                claimed: false
            });
        }

        this.missionProgress = {};
        this.currentMissions.forEach(mission => {
            this.missionProgress[mission.id] = 0;
        });

        this.saveMissions();
    }

    getDailyMissions() {
        return this.currentMissions.map(mission => ({
            ...mission,
            progress: this.missionProgress[mission.id] || 0,
            progressPercent: Math.min(100, ((this.missionProgress[mission.id] || 0) / mission.value) * 100)
        }));
    }

    updateProgress(type, value) {
        let updated = false;

        this.currentMissions.forEach(mission => {
            if (mission.completed || mission.claimed) return;
            
            if (mission.type === type) {
                this.missionProgress[mission.id] = (this.missionProgress[mission.id] || 0) + value;
                mission.progress = this.missionProgress[mission.id];
                
                if (this.missionProgress[mission.id] >= mission.value) {
                    mission.completed = true;
                    updated = true;
                    this.onMissionComplete(mission);
                }
            }
        });

        if (updated) {
            this.saveMissions();
        }

        return updated;
    }

    setProgress(type, value) {
        this.currentMissions.forEach(mission => {
            if (mission.completed || mission.claimed) return;
            
            if (mission.type === type) {
                this.missionProgress[mission.id] = value;
                mission.progress = value;
                
                if (value >= mission.value) {
                    mission.completed = true;
                    this.onMissionComplete(mission);
                }
            }
        });

        this.saveMissions();
    }

    onMissionComplete(mission) {
        eventManager.emit(CONSTANTS.EVENTS.MISSION_COMPLETE, mission);
        
        notificationManager.success(
            'Mission Complete!',
            `${mission.name} - Reward: ${mission.reward} coins`
        );
    }

    claimReward(missionId) {
        const mission = this.currentMissions.find(m => m.id === missionId);
        if (!mission || !mission.completed || mission.claimed) {
            return false;
        }

        mission.claimed = true;
        saveManager.addCoins(mission.reward);
        this.saveMissions();

        notificationManager.reward(
            'Reward Claimed!',
            `+${mission.reward} coins`
        );

        return true;
    }

    canClaimReward(missionId) {
        const mission = this.currentMissions.find(m => m.id === missionId);
        return mission && mission.completed && !mission.claimed;
    }

    getCompletedCount() {
        return this.currentMissions.filter(m => m.completed).length;
    }

    getTotalCount() {
        return this.currentMissions.length;
    }

    getClaimedCount() {
        return this.currentMissions.filter(m => m.claimed).length;
    }

    allClaimed() {
        return this.currentMissions.every(m => m.claimed);
    }

    getTimeUntilReset() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const diff = tomorrow - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${hours}h ${minutes}m`;
    }

    reset() {
        this.generateNewDailyMissions();
    }
}

const missionManager = new MissionManager();
