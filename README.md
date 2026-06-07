# Sky Legends Runner

A premium endless runner adventure game built with Phaser 3, HTML5, CSS3, and JavaScript.

## Features

- **Endless Runner Gameplay** - Run, jump, slide, and collect coins
- **Multiple Characters** - Unlock and play as different heroes
- **Power-ups** - Magnet, Shield, Speed Boost, and Double Coins
- **Enemy System** - Battle various enemies and bosses
- **Combo System** - Build combos for higher scores
- **Daily Rewards** - Login daily for free rewards
- **Mission System** - Complete daily missions for extra coins
- **Shop System** - Buy characters, skins, and boosters
- **Achievement System** - Unlock achievements for special rewards
- **Leaderboard** - Compete for the highest score
- **Material Design UI** - Modern Android-style interface
- **Optimized for Mobile** - 60 FPS performance on Android devices

## Tech Stack

- **HTML5** - Game structure
- **CSS3** - Styling and animations
- **JavaScript ES6+** - Game logic
- **Phaser 3** - Game engine
- **Capacitor** - Android deployment

## Project Structure

```
sky-legends-runner-pro/
├── assets/           # Game assets (icons, backgrounds, etc.)
├── css/              # Stylesheets
│   ├── main.css      # Core styles
│   ├── theme.css     # Theme variables and components
│   ├── animations.css # CSS animations
│   └── responsive.css # Responsive design
├── js/               # JavaScript source
│   ├── config/       # Game configuration
│   ├── utils/        # Utility functions
│   ├── managers/     # Game managers
│   ├── components/   # UI components
│   └── scenes/       # Game scenes
├── data/             # Game data
├── docs/             # Documentation
├── android/          # Android platform
├── index.html        # Entry point
├── package.json      # Dependencies
└── capacitor.config.ts # Capacitor config
```

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Android Studio (for Android builds)

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/haiderfxbot-ai/sky-legends-runner-pro.git
   cd sky-legends-runner-pro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

4. Open in browser:
   ```
   http://localhost:8080
   ```

### Android Build

1. Initialize Capacitor:
   ```bash
   npx cap add android
   npx cap sync android
   ```

2. Open in Android Studio:
   ```bash
   npx cap open android
   ```

3. Build APK:
   ```bash
   cd android && ./gradlew assembleDebug
   ```

## Game Controls

- **Tap Left Side** - Jump
- **Tap Right Side** - Slide
- **Space/Up Arrow** - Jump
- **Down Arrow** - Slide
- **Escape** - Pause

## Performance

- Optimized for 60 FPS on mobile devices
- Object pooling for efficient memory usage
- Texture generation for minimal asset loading
- Responsive design for all screen sizes

## License

MIT License - See LICENSE file for details.

## Credits

- Built with Phaser 3
- UI inspired by Material Design 3
- Fonts: Orbitron, Poppins, Inter
