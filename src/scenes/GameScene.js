// GameScene — main gameplay loop

import Shark from '../objects/Shark.js';
import { ObstacleGroup } from '../objects/Obstacle.js';
import { CollectibleGroup } from '../objects/Collectible.js';
import { Audio } from '../utils/AudioGenerator.js';
import { SHARK_FACTS } from '../data/facts.js';

// Difficulty stages — slightly tighter than original
const STAGES = [
  { name: 'Gentle Waters',   duration: 60000,   scroll: 132, obstFreq: 2500 },
  { name: 'Open Reef',       duration: 60000,   scroll: 162, obstFreq: 2000 },
  { name: 'Feeding Grounds', duration: 60000,   scroll: 200, obstFreq: 1600 },
  { name: 'Danger Zone',     duration: 60000,   scroll: 248, obstFreq: 1250 },
  { name: 'Bimini Elite',    duration: Infinity, scroll: 295, obstFreq: 1000 },
];

export default class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  create() {
    const { width: W, height: H } = this.scale;
    this._W = W; this._H = H;

    // State
    this._lives = 3;
    this._score = 0;
    this._distancePixels = 0;
    this._paused = false;
    this._gameOver = false;
    this._stageIdx = 0;
    this._stageTimer = 0;
    this._scrollSpeed = STAGES[0].scroll;
    this._shownFacts = new Set();
    this._lastFactScore = 0;

    // Input state
    this._holdUp = false;
    this._holdDown = false;

    this._setupBackground();
    this._setupShark();
    this._setupObstacles();
    this._setupCollectibles();
    this._setupBubbles();
    this._setupInput();
    this._setupObstacleTimer();
    this._setupCollectibleTimer();

    // HUD scene events
    this.events.emit('hud-init', { lives: this._lives, score: this._score });

    // Start ambient audio
    Audio.startAmbient();
  }

  _setupBackground() {
    const { _W: W, _H: H } = this;
    this._bgDeep  = this.add.tileSprite(0, 0, W, H, 'bg-deep').setOrigin(0).setDepth(0);
    this._bgMid   = this.add.tileSprite(0, 0, W, H, 'bg-mid').setOrigin(0).setDepth(1);
    this._bgMang  = this.add.tileSprite(0, 0, W, H, 'bg-mangrove').setOrigin(0).setDepth(2);
    this._bgSurf  = this.add.tileSprite(0, 0, W, H, 'bg-surface').setOrigin(0).setDepth(3);
  }

  _setupShark() {
    this._shark = new Shark(this);
    this._shark.setDepth(10);
  }

  _setupObstacles() {
    this._obstacles = new ObstacleGroup(this);
    this._obstacles.onSharkSpawn = (species) => this._showSharkWarning(species);
  }

  _showSharkWarning(species) {
    const W = this._W;
    const txt = this.add.text(W / 2, 22, `⚠ ${species} AHEAD`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '6px',
      color: '#e63946',
      stroke: '#3a0008',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(60).setAlpha(0);

    this.tweens.add({
      targets: txt,
      alpha: 1,
      duration: 80,
      hold: 1100,
      yoyo: true,
      ease: 'Sine.easeInOut',
      onComplete: () => txt.destroy(),
    });
  }

  _setupCollectibles() {
    this._collectibles = new CollectibleGroup(this);
  }

  _setupBubbles() {
    // Simple bubble particles via tweens
    this._bubbleTimer = 0;
  }

  _spawnBubble() {
    const bx = this._shark.x - 8 + Phaser.Math.Between(-4, 4);
    const by = this._shark.y;
    const b = this.add.sprite(bx, by, 'bubble', 0).setDepth(9).setAlpha(0.8);
    this.tweens.add({
      targets: b,
      y: by - 20 - Math.random() * 30,
      alpha: 0,
      duration: 800 + Math.random() * 600,
      onComplete: () => b.destroy(),
    });
  }

  _setupInput() {
    const { _W: W, _H: H } = this;

    // Touch — upper/lower half zones
    this.input.on('pointerdown', (ptr) => {
      Audio.resumeCtx();
      if (ptr.y < H / 2) this._holdUp = true;
      else this._holdDown = true;
    });
    this.input.on('pointermove', (ptr) => {
      if (!ptr.isDown) return;
      this._holdUp   = ptr.y < H / 2;
      this._holdDown = ptr.y >= H / 2;
    });
    this.input.on('pointerup', () => {
      this._holdUp = false;
      this._holdDown = false;
    });

    // Keyboard
    this._keys = this.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.UP,
      down:  Phaser.Input.Keyboard.KeyCodes.DOWN,
      w:     Phaser.Input.Keyboard.KeyCodes.W,
      s:     Phaser.Input.Keyboard.KeyCodes.S,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      esc:   Phaser.Input.Keyboard.KeyCodes.ESC,
    });

    this._keys.space.on('down', () => this._togglePause());
    this._keys.esc.on('down',   () => this._togglePause());
  }

  _setupObstacleTimer() {
    this._obstacleTimer = this.time.addEvent({
      delay: STAGES[this._stageIdx].obstFreq,
      callback: this._spawnObstacle,
      callbackScope: this,
      loop: true,
    });
  }

  _setupCollectibleTimer() {
    this._collectibleTimer = this.time.addEvent({
      delay: 1200,
      callback: () => this._collectibles.spawnBetweenObstacles(this._scrollSpeed),
      callbackScope: this,
      loop: true,
    });
  }

  _spawnObstacle() {
    if (this._paused || this._gameOver) return;
    this._obstacles.spawn(this._scrollSpeed, this._stageIdx);
  }

  update(time, delta) {
    if (this._gameOver) return;
    if (this._paused) return;

    const dt = delta;

    // Difficulty ramp
    this._updateDifficulty(dt);

    // Background scroll
    const sp = this._scrollSpeed;
    this._bgDeep.tilePositionX  += sp * 0.1 * (delta / 1000);
    this._bgMid.tilePositionX   += sp * 0.3 * (delta / 1000);
    this._bgMang.tilePositionX  += sp * 0.6 * (delta / 1000);
    this._bgSurf.tilePositionX  += sp * 1.0 * (delta / 1000);

    // Keyboard input
    const kUp   = this._keys.up.isDown   || this._keys.w.isDown;
    const kDown = this._keys.down.isDown || this._keys.s.isDown;
    const holdUp   = this._holdUp   || kUp;
    const holdDown = this._holdDown || kDown;

    // Shark physics
    this._shark.update(delta, holdUp, holdDown);

    // Distance score
    this._distancePixels += sp * (delta / 1000);
    const distScore = Math.floor(this._distancePixels / 10);

    // Obstacles
    this._obstacles.update(delta, sp);

    // Collectibles
    this._collectibles.update(delta, sp);
    this._collectibles.updatePupTimer(delta, sp);

    // Bubbles
    this._bubbleTimer += delta;
    if (this._bubbleTimer > 300) {
      this._bubbleTimer = 0;
      this._spawnBubble();
    }

    // Collision — obstacles
    if (!this._shark.invincible) {
      const hit = this._obstacles.checkCollision(this._shark.getHitbox());
      if (hit) this._onHit();
    }

    // Collision — collectibles
    const collected = this._collectibles.checkCollection(this._shark.getHitbox());
    collected.forEach(c => this._onCollect(c));

    // Update score (distance-based)
    this._score = distScore + (this._bonusScore || 0);
    this.events.emit('score-update', this._score);

    // Fact trigger every 500 points
    if (this._score - this._lastFactScore >= 500) {
      this._lastFactScore = this._score;
      this._showFact();
    }
  }

  _updateDifficulty(dt) {
    if (this._stageIdx >= STAGES.length - 1) {
      // Bimini Elite: keep ramping
      this._scrollSpeed = Math.min(400, this._scrollSpeed + 0.002 * dt / 1000);
      return;
    }
    this._stageTimer += dt;
    const stageDur = STAGES[this._stageIdx].duration;
    if (this._stageTimer >= stageDur) {
      this._stageTimer = 0;
      this._stageIdx++;
      this._scrollSpeed = STAGES[this._stageIdx].scroll;
      this._obstacleTimer.delay = STAGES[this._stageIdx].obstFreq;
    }
  }

  _onHit() {
    this._lives--;
    Audio.hit();
    this._shark.startInvincibility();
    this.cameras.main.shake(200, 0.008);
    this.events.emit('life-lost', this._lives);

    if (this._lives <= 0) {
      this._onGameOver();
    } else {
      Audio.loseLife();
    }
  }

  _onCollect(collectible) {
    const type = collectible.collectibleType;
    const points = collectible.points;

    this._bonusScore = (this._bonusScore || 0) + points;
    collectible.destroy();

    if (type === 'pup') {
      this._onPupCollected();
    } else if (type === 'jellyfish') {
      Audio.jellyfish();
    } else {
      Audio.collect();
    }
  }

  _onPupCollected() {
    Audio.pup();

    // Slow-mo moment
    this._paused = true;
    const originalSpeed = this._scrollSpeed;
    this._scrollSpeed = originalSpeed * 0.3;
    this._paused = false; // actually keep running but slow

    // Emit for HUD
    this.events.emit('pup-collected');

    // Show pup fact
    this._showFact(true);

    // Speed up camera shake delight
    this.cameras.main.flash(300, 245, 200, 66, true); // golden flash

    this.time.delayedCall(1500, () => {
      this._scrollSpeed = originalSpeed;
    });
  }

  _showFact(force = false) {
    // Pick a fact not yet shown
    const available = [];
    for (let i = 0; i < 40; i++) {
      if (!this._shownFacts.has(i)) available.push(i);
    }
    if (available.length === 0) {
      this._shownFacts.clear();
      for (let i = 0; i < 40; i++) available.push(i);
    }
    const idx = Phaser.Utils.Array.GetRandom(available);
    this._shownFacts.add(idx);
    this.events.emit('show-fact', idx);
  }

  _togglePause() {
    if (this._gameOver) return;
    this._paused = !this._paused;
    if (this._paused) {
      this.scene.pause();
      this.scene.launch('PauseScene', { score: this._score });
      Audio.stopAmbient();
    } else {
      this.scene.resume();
      Audio.startAmbient();
    }
  }

  _onGameOver() {
    this._gameOver = true;
    Audio.gameOver();
    Audio.stopAmbient();

    const hs = parseInt(localStorage.getItem('bimini_highscore') || '0');
    const newHs = Math.max(this._score, hs);
    localStorage.setItem('bimini_highscore', newHs);

    this.time.delayedCall(1000, () => {
      this.scene.stop('HUDScene');
      this.scene.start('GameOverScene', {
        score: this._score,
        highScore: newHs,
        isNewHighScore: this._score > hs,
      });
    });
  }
}
