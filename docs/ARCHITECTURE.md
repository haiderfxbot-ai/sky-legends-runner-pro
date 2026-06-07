# Sky Legends Runner - Architecture Guide

## Overview

Sky Legends Runner is a premium endless runner game built with Phaser 3. The architecture follows a modular, component-based design pattern optimized for mobile performance.

## Core Architecture

### 1. Game Configuration (`js/config/config.js`)
Central configuration file containing:
- Game dimensions and physics settings
- Player configuration
- Scrolling and spawning parameters
- Color themes and layer definitions
- Shop items and achievements

### 2. Scene System (`js/scenes/`)
Phaser scenes organized by game state:

| Scene | Purpose |
|-------|---------|
| BootScene | Initializes textures and assets |
| LoadingScene | Shows loading progress |
| SplashScene | Title screen with animations |
| MainMenuScene | Main navigation hub |
| GameplayScene | Core gameplay loop |
| PauseScene | Pause overlay |
| GameOverScene | End-of-run statistics |
| VictoryScene | Boss defeat rewards |
| ProfileScene | Player statistics |
| MissionScene | Daily missions |
| LeaderboardScene | Score rankings |
| SettingsScene | Audio and game settings |
| ShopScene | In-game store |
| RewardScene | Reward collection |

### 3. Manager System (`js/managers/`)

#### SaveManager
- LocalStorage-based persistence
- Player data, settings, achievements
- Import/export functionality

#### AudioManager
- Music and SFX management
- Volume control per category
- Fade in/out transitions

#### EventManager
- Custom event system
- Decoupled communication between systems
- One-time and persistent listeners

#### UIManager
- Reusable UI component factory
- Cards, buttons, progress bars
- Currency displays and toggles

#### NotificationManager
- Toast-style notifications
- Multiple notification types
- Auto-dismiss with animation

#### AchievementManager
- 15+ achievements with conditions
- Progress tracking
- Reward distribution

#### MissionManager
- Daily mission generation
- Progress tracking
- Reward claiming

#### ShopManager
- Character/skin/booster purchases
- Inventory management
- Currency handling

#### DailyRewardManager
- Streak-based rewards
- 7-day reward cycle
- Login tracking

#### PlayerProgression
- XP and leveling system
- Score and distance tracking
- Leaderboard data

### 4. Component System (`js/components/`)

#### UIComponent
Base class for all UI elements:
- Show/hide with animation
- Scale, fade, slide transitions
- Interactive state management

#### GameButton
- Multiple color themes
- Hover and click animations
- Disabled state support

#### IconButton
- Circular button design
- Icon display
- Callback support

#### GameCard
- Glassmorphism design
- Title, subtitle, icon support
- Highlight states

#### GameProgressBar
- Animated fill
- Text display option
- Customizable colors

#### TabBar
- Multi-tab navigation
- Active indicator
- Callback on change

### 5. Utility System (`js/utils/`)

#### Constants
- Game states
- Event names
- Theme definitions
- Particle configurations

#### Helpers
- Math utilities
- Color manipulation
- Texture generation
- Formatting functions

#### ObjectPool
- Memory-efficient object reuse
- SpritePool, GroupPool variants

## Data Flow

```
User Input → Scene → Manager → SaveManager → LocalStorage
                ↓
            EventManager → UI Updates
                ↓
            AudioManager → Sound Effects
```

## Performance Optimization

### Texture Generation
- Procedural textures reduce asset loading
- Canvas-based texture creation
- Minimal memory footprint

### Object Pooling
- Reuse sprites and text objects
- Pre-allocated pools
- Automatic cleanup

### Physics
- Arcade physics for simplicity
- Optimized collision groups
- Minimal gravity calculations

### Rendering
- Layer-based depth system
- Efficient sprite batching
- Minimal draw calls

## Mobile Optimization

### Touch Controls
- Zone-based input detection
- Gesture recognition (tap left/right)
- Responsive button sizes

### Performance
- 60 FPS target
- Memory-efficient design
- Battery-friendly updates

### Screen Support
- Portrait mode enforced
- Safe area support
- Notch handling

## Build System

### Development
```bash
npm start  # Local server on port 8080
```

### Android
```bash
npx cap add android
npx cap sync android
cd android && ./gradlew assembleDebug
```

### Production
- GitHub Actions CI/CD
- Automated APK/AAB builds
- Release automation

## Future Enhancements

1. **Multiplayer** - Real-time competition
2. **Procedural Levels** - Dynamic obstacle generation
3. **Sound Effects** - Custom audio assets
4. **Analytics** - Player behavior tracking
5. **Localization** - Multi-language support
