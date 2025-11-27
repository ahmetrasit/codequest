# CODE QUEST 🎮

A 3D Low-Poly Action RPG Progressive Web App built with React, Three.js, and modern web technologies.

## 🚀 Project Overview

CODE QUEST is a browser-based 3D action RPG featuring:
- Low-poly aesthetic 3D graphics
- Progressive Web App capabilities (installable, offline support)
- Real-time 3D rendering with Three.js
- Responsive UI built with React and Tailwind CSS
- Global state management with Zustand

## 📋 Tech Stack

### Core Technologies
- **Vite** - Fast build tool and dev server
- **React 18** - UI framework
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for react-three-fiber

### Styling & UI
- **Tailwind CSS v4** - Utility-first CSS framework
- **PostCSS** - CSS processing
- Custom game-themed color palette

### State Management
- **Zustand** - Lightweight state management
- Devtools middleware for debugging

### PWA Support
- **vite-plugin-pwa** - PWA support for Vite
- **Workbox** - Service worker and caching strategies
- Offline-ready architecture

## 🏗️ Project Structure

```
/src
  /components
    /ui              # UI components (HUD, menus, dialogs)
    /game            # 3D game entities and objects
  /systems           # Game systems and state management
  /world             # World generation and environment
  /data              # Game data and configurations
  /utils             # Utility functions and helpers
  /assets
    /models          # 3D model files
    /textures        # Texture files
    /audio           # Audio files
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd codequest
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Production Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🎨 Features Implemented (Phase 1)

### ✅ 1. Vite + React + Tailwind Setup
- Initialized Vite project with React template
- Configured Tailwind CSS v4 with custom game colors
- Set up PostCSS processing
- Verified build pipeline

### ✅ 2. Three.js Integration
- Installed and configured Three.js ecosystem
- Created 3D scene with low-poly aesthetic
- Implemented rotating dodecahedron demo object
- Added ambient and directional lighting
- Set up camera with OrbitControls
- Added ground plane for spatial reference

### ✅ 3. Project Folder Structure
- Organized component hierarchy
- Created dedicated directories for systems, world, data, utils
- Set up asset directories for models, textures, audio
- Added documentation in each directory

### ✅ 4. Zustand State Management
- Installed Zustand for global state
- Created comprehensive game store with:
  - Player state (stats, position, inventory, combat)
  - World state (zones, enemies, NPCs, time)
  - UI state (menus, dialogs, notifications)
  - Game settings (audio, difficulty)
- Implemented action methods for all state updates
- Added devtools middleware for debugging
- Created HUD component demonstrating state usage

### ✅ 5. PWA Configuration
- Installed and configured vite-plugin-pwa
- Created app manifest with CODE QUEST branding
- Set up Workbox service worker with caching strategies
- Added PWA meta tags and theme colors
- Created placeholder favicon and icon documentation
- Configured offline support
- Enabled PWA dev mode for testing

## 🎮 Current Features

### 3D Scene
- Low-poly rotating dodecahedron (demo object)
- Flat shading for low-poly aesthetic
- Dynamic lighting (ambient + directional)
- Interactive camera controls (orbit, zoom, pan)
- Ground plane with game-themed colors

### HUD/UI
- Player stats display (health, stamina, mana)
- Experience bar with level tracking
- Current zone indicator
- Responsive stat bars with smooth animations
- Game-themed color scheme

### State Management
- Centralized game state
- Player stats tracking
- Leveling system with experience
- UI state management
- Settings persistence ready

## 🎯 Next Steps (Future Phases)

### Phase 2: Player Character & Controls
- Character model and animations
- Keyboard/gamepad input handling
- Movement system (WASD/arrow keys)
- Camera follow system
- Jump/dodge mechanics

### Phase 3: Combat System
- Attack animations and hitboxes
- Damage calculation
- Enemy AI
- Stamina-based combat
- Skill system

### Phase 4: World & Environment
- Procedural terrain generation
- Zone transitions
- Environmental objects
- Day/night cycle
- Weather system

### Phase 5: Progression & Items
- Inventory system
- Equipment management
- Loot drops
- Character stats/leveling
- Skill trees

## 🎨 Color Palette

```css
game-dark:      #1a1a2e  /* Background */
game-primary:   #16213e  /* UI primary */
game-secondary: #0f3460  /* UI secondary */
game-accent:    #00d9ff  /* Cyan highlights */
game-highlight: #ff00ff  /* Magenta accents */
```

## 📱 PWA Features

- **Installable**: Add to home screen on mobile/desktop
- **Offline Ready**: Service worker caching
- **Fast Loading**: Precached assets
- **Responsive**: Adapts to different screen sizes
- **Landscape Optimized**: Best played in landscape mode

## 🧪 Testing the PWA

1. Build the production version: `npm run build`
2. Serve it locally: `npm run preview`
3. Open in browser (HTTPS required for service workers)
4. Look for "Install" button in browser address bar
5. Check DevTools > Application > Service Workers

## 🔧 Configuration Files

- `vite.config.js` - Vite and PWA configuration
- `tailwind.config.js` - Tailwind CSS customization
- `postcss.config.js` - PostCSS plugins
- `package.json` - Dependencies and scripts
- `src/systems/gameStore.js` - Zustand state store

## 📝 Development Notes

### Dependencies
- Using `--legacy-peer-deps` flag for some packages due to React 18/19 peer dependency conflicts
- Three.js bundle size is large (~1MB); consider code splitting in future

### Browser Compatibility
- Modern browsers with WebGL support required
- PWA features require HTTPS (except localhost)
- Landscape orientation recommended for gameplay

### Performance
- 3D rendering can be intensive on mobile devices
- Consider adding quality settings (low/medium/high)
- Monitor FPS and implement LOD (Level of Detail) systems

## 📄 License

[Add license information here]

## 👥 Contributors

- Agent 1 - Senior Implementation Agent (Phase 1 Foundation)

---

**Status**: Phase 1 Complete ✅
**Last Updated**: 2025-11-27
**Version**: 0.1.0
