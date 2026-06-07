const CONSTANTS = {
    STATES: {
        IDLE: 'idle',
        RUNNING: 'running',
        JUMPING: 'jumping',
        DOUBLE_JUMPING: 'double_jumping',
        SLIDING: 'sliding',
        FALLING: 'falling',
        DEAD: 'dead',
        VICTORY: 'victory'
    },

    SCENES: {
        BOOT: 'BootScene',
        LOADING: 'LoadingScene',
        SPLASH: 'SplashScene',
        MAIN_MENU: 'MainMenuScene',
        PROFILE: 'ProfileScene',
        REWARD: 'RewardScene',
        MISSION: 'MissionScene',
        LEADERBOARD: 'LeaderboardScene',
        SETTINGS: 'SettingsScene',
        SHOP: 'ShopScene',
        GAMEPLAY: 'GameplayScene',
        PAUSE: 'PauseScene',
        GAME_OVER: 'GameOverScene',
        VICTORY: 'VictoryScene'
    },

    EVENTS: {
        GAME_START: 'game:start',
        GAME_PAUSE: 'game:pause',
        GAME_RESUME: 'game:resume',
        GAME_OVER: 'game:over',
        GAME_VICTORY: 'game:victory',
        PLAYER_DIE: 'player:die',
        PLAYER_JUMP: 'player:jump',
        PLAYER_SLIDE: 'player:slide',
        COIN_COLLECTED: 'coin:collected',
        GEM_COLLECTED: 'gem:collected',
        POWERUP_COLLECTED: 'powerup:collected',
        ENEMY_DEFEATED: 'enemy:defeated',
        BOSS_DEFEATED: 'boss:defeated',
        OBSTACLE_HIT: 'obstacle:hit',
        SCORE_UPDATE: 'score:update',
        COMBO_UPDATE: 'combo:update',
        XP_UPDATE: 'xp:update',
        LEVEL_UP: 'level:up',
        ACHIEVEMENT_UNLOCK: 'achievement:unlock',
        MISSION_COMPLETE: 'mission:complete',
        DAILY_REWARD: 'daily:reward',
        SHOP_PURCHASE: 'shop:purchase',
        SETTINGS_CHANGED: 'settings:changed',
        NOTIFICATION_SHOW: 'notification:show',
        NOTIFICATION_HIDE: 'notification:hide'
    },

    THEMES: {
        SKY: {
            name: 'Sky Kingdom',
            background: [0x1a1a2e, 0x16213e, 0x0f3460],
            ground: 0x2d5016,
            obstacles: 0xF44336
        },
        FOREST: {
            name: 'Dark Forest',
            background: [0x1a2e1a, 0x0f3e0f, 0x064e06],
            ground: 0x2d3d16,
            obstacles: 0x8B4513
        },
        VOLCANO: {
            name: 'Fire Mountain',
            background: [0x2e1a1a, 0x3e0f0f, 0x600f0f],
            ground: 0x3d2d16,
            obstacles: 0xFF4500
        },
        ICE: {
            name: 'Frozen Peak',
            background: [0x1a2e3e, 0x0f3e5e, 0x0f6090],
            ground: 0x87CEEB,
            obstacles: 0x00BFFF
        },
        VOID: {
            name: 'Shadow Realm',
            background: [0x0a0a0a, 0x1a0a2e, 0x2e0a3e],
            ground: 0x1a1a1a,
            obstacles: 0x9C27B0
        }
    },

    PARTICLES: {
        COIN: {
            texture: 'particle_coin',
            speed: { min: 100, max: 200 },
            lifespan: 800,
            quantity: 10,
            scale: { start: 0.5, end: 0 },
            tint: 0xFFD700
        },
        JUMP: {
            texture: 'particle_dust',
            speed: { min: 50, max: 100 },
            lifespan: 500,
            quantity: 5,
            scale: { start: 0.3, end: 0 },
            tint: 0xFFFFFF,
            angle: { min: 220, max: 320 }
        },
        DEATH: {
            texture: 'particle_explosion',
            speed: { min: 100, max: 300 },
            lifespan: 1000,
            quantity: 30,
            scale: { start: 0.5, end: 0 },
            tint: 0xF44336
        },
        LEVEL_UP: {
            texture: 'particle_star',
            speed: { min: 50, max: 150 },
            lifespan: 1500,
            quantity: 50,
            scale: { start: 0.4, end: 0 },
            tint: 0x00E5FF
        }
    }
};
