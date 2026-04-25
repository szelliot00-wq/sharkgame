# 🦈 Lemon Shark: Bimini Run

A pixel-art side-scrolling endless runner built for a 17-year-old lemon shark enthusiast. You play as a lemon shark swimming through the shallow mangrove waters of Bimini in the Bahamas — home of the [Bimini Biological Field Station](https://www.biminisharklab.com/), the world's most important lemon shark research site.

**Sharks are the hero. Humans are the hazard.**

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Game engine | [Phaser 3](https://phaser.io/) |
| Dev server / build | [Vite](https://vitejs.dev/) |
| Language | Vanilla JavaScript |
| Sprites | Canvas 2D API — zero external image files |
| Audio | Web Audio API oscillators — zero external audio files |
| Font | Press Start 2P (Google Fonts) |
| Port | `:5175` (SharkWatch runs on `:5174`) |

---

## Running locally

```bash
npm install
npm run dev
# → http://localhost:5175
# → http://<your-lan-ip>:5175  (for phone/tablet on same WiFi)
```

## Deploying to MacBook Pro (192.168.71.250)

```bash
npm run deploy
# Builds → rsyncs dist/ → pm2 restart
```

First-time setup on the MacBook Pro:
```bash
npm install -g pm2
# After first deploy:
pm2 save
```

LaunchAgent plist is in `scripts/com.steveelliott.biminirun.plist` — copy to `~/Library/LaunchAgents/` and run `launchctl load` to auto-start on login.

---

## Project structure

```
sharkgame/
├── src/
│   ├── main.js                 Phaser config + scene list
│   ├── scenes/
│   │   ├── BootScene.js        Generates all sprites, loading bar
│   │   ├── TitleScene.js       Animated title, lazy swimming shark
│   │   ├── GameScene.js        Main gameplay loop
│   │   ├── HUDScene.js         Parallel HUD (lives, score, fact cards)
│   │   ├── GameOverScene.js    Score, high score, auto-return
│   │   └── PauseScene.js       Pause overlay with shark fact
│   ├── objects/
│   │   ├── Shark.js            Player lemon shark (physics, invincibility)
│   │   ├── Obstacle.js         All obstacles incl. rival shark species
│   │   └── Collectible.js      Fish, jellyfish, shark pup
│   ├── utils/
│   │   ├── SpriteGenerator.js  All sprites drawn with Canvas 2D bezier curves
│   │   └── AudioGenerator.js   All sounds synthesised with Web Audio API
│   └── data/
│       └── facts.js            120 shark facts (all species)
├── scripts/
│   └── com.steveelliott.biminirun.plist  launchd config
├── index.html
├── vite.config.js
└── package.json
```

---

## Gameplay

- **Controls**: hold top half of screen → swim up · hold bottom half → swim down · release → drift to centre
- **Keyboard**: Arrow keys / WASD · Space = pause · Esc = pause
- **Lives**: 3 — no regeneration
- **Scoring**: 1pt per 10px scrolled + collectible bonuses · high score saved to localStorage

### Obstacles

| Obstacle | Appears |
|----------|---------|
| Fishing net | Stage 1 |
| Longlining hooks | Stage 1 |
| Boat propeller | Stage 2 |
| **Scuba diver** 🤿 | Stage 1 — horizontal swimmer, increases every stage |
| **Bull shark** 🦈 | Stage 1 — swims straight across |
| **Tiger shark** 🦈 | Stage 3 — patrols up and down |
| **Great hammerhead** 🦈 | Stage 4 — drifts in diagonally |

### Difficulty stages

Speed ramps continuously at +0.9 px/s per second within every stage. Obstacle frequency also tightens progressively. Bimini Elite has no speed cap.

| Stage | Time | Starting speed |
|-------|------|----------------|
| Gentle Waters | 0–45s | 150 px/s |
| Open Reef | 45–90s | 190 px/s |
| Feeding Grounds | 90–135s | 235 px/s |
| Danger Zone | 135–180s | 285 px/s |
| Bimini Elite | 180s+ | 330+ px/s (uncapped) |

### Collectibles

| Item | Points |
|------|--------|
| Mullet | 10 |
| Snapper | 25 |
| Jellyfish | 5 |
| Shark pup 🦈 | 150 + slow-mo moment + fact card |
| Whale shark 🐋 | 500 + slow-mo + turquoise flash + banner |

---

## SharkWatch integration

Embedded in SharkWatch via the **🎮 Bimini Run** tab in the Research Hub bottom strip. If the game server is unreachable, SharkWatch shows a friendly prompt to start the server.

Component: `Sharks/src/components/media/BiminiRunTab.jsx`

---

## Lemon shark facts

120 facts in `src/data/facts.js` covering lemon sharks, great whites, whale sharks, bull sharks, tiger sharks, hammerheads, makos, basking sharks, nurse sharks, Greenland sharks, thresher sharks, blue sharks, weird & wonderful species, and general shark biology. All scientifically accurate. Facts appear every 500 points, when a shark pup is collected, and when a whale shark is collected. Fact cards are displayed in a large readable overlay (6px Press Start 2P, 310×85px card, 5.5 second display).

---

*Built with Claude Code · Based on real research at the Bimini Biological Field Station, Bahamas*
