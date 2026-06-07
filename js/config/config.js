const GAME_CONFIG = {
    GAME_WIDTH: 720,
    GAME_HEIGHT: 1280,
    GAME_NAME: 'Sky Legends Runner',
    GAME_VERSION: '1.0.0',
    
    PHYSICS: {
        GRAVITY: 1800,
        JUMP_FORCE: -650,
        DOUBLE_JUMP_FORCE: -550,
        SLIDE_SPEED: 0,
        MAX_FALL_SPEED: 1200
    },

    PLAYER: {
        SPEED: 350,
        START_X: 150,
        START_Y: 900,
        INVINCIBLE_DURATION: 3000,
        SIZE: { width: 64, height: 96 }
    },

    SCROLL: {
        BASE_SPEED: 300,
        MAX_SPEED: 800,
        SPEED_INCREMENT: 0.5,
        GROUND_Y: 1050
    },

    SPAWNING: {
        OBSTACLE_INTERVAL: { min: 1200, max: 2500 },
        COIN_INTERVAL: { min: 800, max: 1500 },
        ENEMY_INTERVAL: { min: 3000, max: 6000 },
        POWERUP_INTERVAL: { min: 8000, max: 15000 },
        BOSS_INTERVAL: 30000,
        MIN_SPAWN_DISTANCE: 400
    },

    SCORING: {
        COIN_VALUE: 10,
        GEM_VALUE: 50,
        DISTANCE_MULTIPLIER: 1,
        COMBO_MULTIPLIER: 0.5,
        MAX_COMBO: 10,
        COMBO_TIMEOUT: 2000
    },

    PROGRESSION: {
        XP_PER_LEVEL: 100,
        XP_GROWTH: 1.5,
        MAX_LEVEL: 100,
        XP_PER_COIN: 1,
        XP_PER_ENEMY: 10,
        XP_PER_DISTANCE: 0.1,
        XP_PER_BOSS: 100
    },

    COLORS: {
        PRIMARY: 0x6750A4,
        PRIMARY_LIGHT: 0x7F67BE,
        PRIMARY_DARK: 0x4F378B,
        SECONDARY: 0x7F67BE,
        ACCENT: 0x00E5FF,
        ACCENT_DARK: 0x00B8D4,
        SUCCESS: 0x4CAF50,
        WARNING: 0xFFC107,
        DANGER: 0xF44336,
        BACKGROUND: 0x121212,
        SURFACE: 0x1E1E1E,
        TEXT: 0xFFFFFF,
        COIN: 0xFFD700,
        GEM: 0x00E5FF,
        SHIELD: 0x4CAF50,
        MAGNET: 0xF44336,
        SPEED: 0xFFC107
    },

    LAYERS: {
        BACKGROUND: 0,
        BACKGROUND_FAR: 1,
        BACKGROUND_MID: 2,
        BACKGROUND_NEAR: 3,
        GROUND: 4,
        OBSTACLES: 5,
        COLLECTIBLES: 6,
        ENEMIES: 7,
        PLAYER: 8,
        EFFECTS: 9,
        UI: 10
    },

    STORAGE_KEYS: {
        PLAYER_DATA: 'sky_legends_player_data',
        SETTINGS: 'sky_legends_settings',
        ACHIEVEMENTS: 'sky_legends_achievements',
        MISSIONS: 'sky_legends_missions',
        SHOP: 'sky_legends_shop',
        DAILY: 'sky_legends_daily'
    },

    PHASER_CONFIG: {
        type: Phaser.AUTO,
        parent: 'game-container',
        width: 720,
        height: 1280,
        backgroundColor: '#121212',
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            min: {
                width: 360,
                height: 640
            },
            max: {
                width: 1080,
                height: 1920
            }
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: [],
        render: {
            pixelArt: false,
            antialias: true,
            roundPixels: true,
            transparent: false
        },
        input: {
            activePointers: 3
        },
        audio: {
            disableWebAudio: false
        },
        fps: {
            target: 60,
            forceSetTimeOut: false
        },
        banner: false
    }
};

const OBSTACLE_TYPES = {
    BLOCK: {
        key: 'obstacle_block',
        width: 60,
        height: 60,
        color: 0xF44336,
        damage: true,
        ground: true
    },
    TALL_BLOCK: {
        key: 'obstacle_tall',
        width: 60,
        height: 120,
        color: 0xF44336,
        damage: true,
        ground: true
    },
    FLOATING_BLOCK: {
        key: 'obstacle_floating',
        width: 80,
        height: 40,
        color: 0xFF6B6B,
        damage: true,
        ground: false
    },
    SPIKE: {
        key: 'obstacle_spike',
        width: 50,
        height: 50,
        color: 0xD32F2F,
        damage: true,
        ground: true
    },
    BARRIER: {
        key: 'obstacle_barrier',
        width: 120,
        height: 200,
        color: 0xB71C1C,
        damage: true,
        ground: true,
        slideUnder: true
    }
};

const ENEMY_TYPES = {
    SLIME: {
        key: 'enemy_slime',
        width: 48,
        height: 40,
        color: 0x4CAF50,
        health: 1,
        speed: 1.2,
        damage: true,
        ground: true
    },
    BAT: {
        key: 'enemy_bat',
        width: 50,
        height: 36,
        color: 0x9C27B0,
        health: 1,
        speed: 1.5,
        damage: true,
        ground: false,
        flyHeight: 200
    },
    GOBLIN: {
        key: 'enemy_goblin',
        width: 52,
        height: 64,
        color: 0x8BC34A,
        health: 2,
        speed: 1.0,
        damage: true,
        ground: true
    },
    SKELETON: {
        key: 'enemy_skeleton',
        width: 56,
        height: 72,
        color: 0xECEFF1,
        health: 3,
        speed: 0.8,
        damage: true,
        ground: true
    },
    DRAGON: {
        key: 'enemy_dragon',
        width: 80,
        height: 60,
        color: 0xFF5722,
        health: 5,
        speed: 1.3,
        damage: true,
        ground: false,
        flyHeight: 150
    }
};

const POWERUP_TYPES = {
    MAGNET: {
        key: 'powerup_magnet',
        color: 0xF44336,
        duration: 10000,
        icon: 'M',
        description: 'Attracts all nearby coins'
    },
    SHIELD: {
        key: 'powerup_shield',
        color: 0x4CAF50,
        duration: 8000,
        icon: 'S',
        description: 'Protects from one hit'
    },
    SPEED: {
        key: 'powerup_speed',
        color: 0xFFC107,
        duration: 6000,
        icon: '⚡',
        description: 'Increases speed'
    },
    DOUBLE_COINS: {
        key: 'powerup_double',
        color: 0xFFD700,
        duration: 10000,
        icon: 'x2',
        description: 'Doubles coin values'
    }
};

const SHOP_ITEMS = {
    CHARACTERS: [
        { id: 'knight', name: 'Knight', price: 0, currency: 'coins', description: 'A brave warrior' },
        { id: 'mage', name: 'Mage', price: 500, currency: 'coins', description: 'Master of magic' },
        { id: 'ninja', name: 'Ninja', price: 1000, currency: 'coins', description: 'Swift and silent' },
        { id: 'dragon_rider', name: 'Dragon Rider', price: 50, currency: 'gems', description: 'Rides dragons' },
        { id: 'shadow', name: 'Shadow', price: 100, currency: 'gems', description: 'Dark and mysterious' },
        { id: 'celestial', name: 'Celestial', price: 200, currency: 'gems', description: 'From the stars' }
    ],
    SKINS: [
        { id: 'fire', name: 'Fire Skin', price: 300, currency: 'coins', character: 'knight' },
        { id: 'ice', name: 'Ice Skin', price: 300, currency: 'coins', character: 'knight' },
        { id: 'lightning', name: 'Lightning Skin', price: 300, currency: 'coins', character: 'mage' },
        { id: 'shadow', name: 'Shadow Skin', price: 50, currency: 'gems', character: 'knight' },
        { id: 'golden', name: 'Golden Skin', price: 100, currency: 'gems', character: 'knight' }
    ],
    BOOSTERS: [
        { id: 'revive', name: 'Revive', price: 20, currency: 'gems', description: 'Continue after death' },
        { id: 'magnet_start', name: 'Magnet Start', price: 10, currency: 'gems', description: 'Start with magnet' },
        { id: 'shield_start', name: 'Shield Start', price: 15, currency: 'gems', description: 'Start with shield' },
        { id: 'double_coins_start', name: 'Double Coins Start', price: 12, currency: 'gems', description: 'Start with double coins' },
        { id: 'score_boost', name: 'Score Boost', price: 8, currency: 'gems', description: '+50% score for 1 run' }
    ]
};

const ACHIEVEMENTS = [
    { id: 'first_run', name: 'First Steps', description: 'Complete your first run', icon: '🏃', reward: 100, condition: { type: 'runs', value: 1 } },
    { id: 'distance_1k', name: 'Marathon Runner', description: 'Run 1000 meters', icon: '🏃', reward: 200, condition: { type: 'distance', value: 1000 } },
    { id: 'distance_5k', name: 'Endurance Master', description: 'Run 5000 meters', icon: '🏅', reward: 500, condition: { type: 'distance', value: 5000 } },
    { id: 'distance_10k', name: 'Legendary Runner', description: 'Run 10000 meters', icon: '🏆', reward: 1000, condition: { type: 'distance', value: 10000 } },
    { id: 'coins_100', name: 'Coin Collector', description: 'Collect 100 coins', icon: '💰', reward: 150, condition: { type: 'total_coins', value: 100 } },
    { id: 'coins_1000', name: 'Wealthy', description: 'Collect 1000 coins', icon: '💰', reward: 500, condition: { type: 'total_coins', value: 1000 } },
    { id: 'score_10k', name: 'High Scorer', description: 'Score 10000 points', icon: '⭐', reward: 300, condition: { type: 'score', value: 10000 } },
    { id: 'score_50k', name: 'Score Master', description: 'Score 50000 points', icon: '⭐', reward: 1000, condition: { type: 'score', value: 50000 } },
    { id: 'enemies_10', name: 'Monster Slayer', description: 'Defeat 10 enemies', icon: '⚔️', reward: 200, condition: { type: 'enemies', value: 10 } },
    { id: 'enemies_100', name: 'Dragon Hunter', description: 'Defeat 100 enemies', icon: '🐉', reward: 1000, condition: { type: 'enemies', value: 100 } },
    { id: 'combo_5', name: 'Combo King', description: 'Reach 5x combo', icon: '🔥', reward: 200, condition: { type: 'combo', value: 5 } },
    { id: 'combo_10', name: 'Combo Legend', description: 'Reach 10x combo', icon: '🔥', reward: 500, condition: { type: 'combo', value: 10 } },
    { id: 'level_10', name: 'Rising Star', description: 'Reach level 10', icon: '🌟', reward: 300, condition: { type: 'level', value: 10 } },
    { id: 'level_50', name: 'Veteran', description: 'Reach level 50', icon: '🌟', reward: 1500, condition: { type: 'level', value: 50 } },
    { id: 'boss_first', name: 'Boss Slayer', description: 'Defeat your first boss', icon: '👑', reward: 500, condition: { type: 'bosses', value: 1 } }
];

const DAILY_MISSIONS = [
    { id: 'daily_distance', name: 'Run 2000m', reward: 100, type: 'distance', value: 2000, icon: '🏃' },
    { id: 'daily_coins', name: 'Collect 500 coins', reward: 150, type: 'coins', value: 500, icon: '💰' },
    { id: 'daily_enemies', name: 'Defeat 10 enemies', reward: 200, type: 'enemies', value: 10, icon: '⚔️' },
    { id: 'daily_score', name: 'Score 20000 points', reward: 250, type: 'score', value: 20000, icon: '⭐' },
    { id: 'daily_combo', name: 'Reach 5x combo', reward: 150, type: 'combo', value: 5, icon: '🔥' }
];

const DAILY_REWARDS = [
    { day: 1, coins: 100, gems: 0 },
    { day: 2, coins: 150, gems: 0 },
    { day: 3, coins: 200, gems: 5 },
    { day: 4, coins: 250, gems: 0 },
    { day: 5, coins: 300, gems: 10 },
    { day: 6, coins: 400, gems: 0 },
    { day: 7, coins: 500, gems: 25 }
];
