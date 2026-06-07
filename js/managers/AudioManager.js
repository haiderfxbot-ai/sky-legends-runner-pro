class AudioManager {
    constructor() {
        this.scene = null;
        this.musicVolume = 0.7;
        this.sfxVolume = 1.0;
        this.musicEnabled = true;
        this.sfxEnabled = true;
        this.currentMusic = null;
        this.currentMusicKey = null;
        this.sounds = {};
        this.music = {};
        this.initialized = false;
    }

    init(scene) {
        this.scene = scene;
        this.loadSettings();
        this.initialized = true;
    }

    loadSettings() {
        const settings = saveManager.getSettings();
        this.musicVolume = settings.musicVolume;
        this.sfxVolume = settings.sfxVolume;
        this.musicEnabled = settings.musicEnabled;
        this.sfxEnabled = settings.sfxEnabled;
    }

    saveSettings() {
        saveManager.saveSettings({
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume,
            musicEnabled: this.musicEnabled,
            sfxEnabled: this.sfxEnabled
        });
    }

    loadAudio(key, type = 'sfx') {
        if (!this.scene) return null;
        
        try {
            const audio = this.scene.sound.add(key, {
                volume: type === 'music' ? this.musicVolume : this.sfxVolume,
                loop: type === 'music'
            });
            
            if (type === 'music') {
                this.music[key] = audio;
            } else {
                this.sounds[key] = audio;
            }
            
            return audio;
        } catch (e) {
            console.warn(`Failed to load audio: ${key}`, e);
            return null;
        }
    }

    loadMusic(key) {
        return this.loadAudio(key, 'music');
    }

    loadSfx(key) {
        return this.loadAudio(key, 'sfx');
    }

    playMusic(key, fadeIn = true) {
        if (!this.musicEnabled || !this.music[key]) return;
        
        if (this.currentMusic && this.currentMusicKey !== key) {
            this.stopMusic(true);
        }
        
        this.currentMusic = this.music[key];
        this.currentMusicKey = key;
        this.currentMusic.setLoop(true);
        this.currentMusic.setVolume(this.musicVolume);
        
        if (fadeIn) {
            this.currentMusic.setVolume(0);
            this.currentMusic.play();
            this.fadeInMusic(1000);
        } else {
            this.currentMusic.play();
        }
    }

    stopMusic(fadeOut = true) {
        if (!this.currentMusic) return;
        
        if (fadeOut) {
            this.fadeOutMusic(500, () => {
                this.currentMusic.stop();
                this.currentMusic = null;
                this.currentMusicKey = null;
            });
        } else {
            this.currentMusic.stop();
            this.currentMusic = null;
            this.currentMusicKey = null;
        }
    }

    pauseMusic() {
        if (this.currentMusic && this.currentMusic.isPlaying) {
            this.currentMusic.pause();
        }
    }

    resumeMusic() {
        if (this.currentMusic && !this.currentMusic.isPlaying) {
            this.currentMusic.resume();
        }
    }

    fadeInMusic(duration) {
        if (!this.currentMusic) return;
        
        if (this.scene && this.scene.tweens) {
            this.scene.tweens.add({
                targets: this.currentMusic,
                volume: this.musicVolume,
                duration: duration,
                ease: 'Linear'
            });
        } else {
            this.currentMusic.setVolume(this.musicVolume);
        }
    }

    fadeOutMusic(duration, onComplete) {
        if (!this.currentMusic) {
            if (onComplete) onComplete();
            return;
        }
        
        if (this.scene && this.scene.tweens) {
            this.scene.tweens.add({
                targets: this.currentMusic,
                volume: 0,
                duration: duration,
                ease: 'Linear',
                onComplete: onComplete
            });
        } else {
            this.currentMusic.setVolume(0);
            if (onComplete) onComplete();
        }
    }

    playSfx(key, volume = null) {
        if (!this.sfxEnabled || !this.sounds[key]) return;
        
        const sound = this.sounds[key];
        sound.setVolume(volume !== null ? volume : this.sfxVolume);
        
        if (sound.isPlaying) {
            sound.stop();
        }
        sound.play();
    }

    playButtonSound() {
        this.playSfx('button_click', 0.5);
    }

    playCoinSound() {
        this.playSfx('coin_collect');
    }

    playGemSound() {
        this.playSfx('gem_collect');
    }

    playJumpSound() {
        this.playSfx('player_jump');
    }

    playSlideSound() {
        this.playSfx('player_slide');
    }

    playHitSound() {
        this.playSfx('player_hit');
    }

    playDeathSound() {
        this.playSfx('player_death');
    }

    playPowerupSound() {
        this.playSfx('powerup_collect');
    }

    playEnemyDefeatSound() {
        this.playSfx('enemy_defeat');
    }

    playLevelUpSound() {
        this.playSfx('level_up');
    }

    playAchievementSound() {
        this.playSfx('achievement_unlock');
    }

    playVictorySound() {
        this.playSfx('victory');
    }

    playGameOverSound() {
        this.playSfx('game_over');
    }

    setMusicVolume(volume) {
        this.musicVolume = Helpers.clamp(volume, 0, 1);
        if (this.currentMusic) {
            this.currentMusic.setVolume(this.musicVolume);
        }
        this.saveSettings();
    }

    setSfxVolume(volume) {
        this.sfxVolume = Helpers.clamp(volume, 0, 1);
        this.saveSettings();
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled) {
            this.resumeMusic();
        } else {
            this.pauseMusic();
        }
        this.saveSettings();
        return this.musicEnabled;
    }

    toggleSfx() {
        this.sfxEnabled = !this.sfxEnabled;
        this.saveSettings();
        return this.sfxEnabled;
    }

    muteAll() {
        this.musicEnabled = false;
        this.sfxEnabled = false;
        this.pauseMusic();
        this.saveSettings();
    }

    unmuteAll() {
        this.musicEnabled = true;
        this.sfxEnabled = true;
        this.resumeMusic();
        this.saveSettings();
    }

    destroy() {
        Object.values(this.sounds).forEach(sound => {
            if (sound) sound.destroy();
        });
        Object.values(this.music).forEach(music => {
            if (music) music.destroy();
        });
        this.sounds = {};
        this.music = {};
        this.currentMusic = null;
        this.currentMusicKey = null;
    }
}

const audioManager = new AudioManager();
