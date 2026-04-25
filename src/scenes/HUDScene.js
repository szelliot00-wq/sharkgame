// HUDScene — runs in parallel with GameScene, never paused

import { SHARK_FACTS } from '../data/facts.js';
import { Audio } from '../utils/AudioGenerator.js';

const MAX_LIVES = 3;

export default class HUDScene extends Phaser.Scene {
  constructor() { super('HUDScene'); }

  create() {
    const { width: W, height: H } = this.scale;

    this._lives = 3;
    this._score = 0;
    this._muted = Audio.isMuted();

    // Life icons — top left
    this._lifeIcons = [];
    for (let i = 0; i < MAX_LIVES; i++) {
      const icon = this.add.sprite(8 + i * 16, 8, 'life-icon', 0).setOrigin(0, 0).setDepth(100);
      this._lifeIcons.push(icon);
    }

    // Score — top right
    this._scoreTxt = this.add.text(W - 4, 4, '0', {
      fontFamily: '"Press Start 2P"',
      fontSize: '7px',
      color: '#52b788',
    }).setOrigin(1, 0).setDepth(100);

    // High score — top centre
    this._hsTxt = this.add.text(W / 2, 4, '', {
      fontFamily: '"Press Start 2P"',
      fontSize: '5px',
      color: '#f5c842',
      alpha: 0,
    }).setOrigin(0.5, 0).setDepth(100);

    // Mute button — top right corner
    this._muteBtn = this.add.text(W - 4, 16, this._muted ? '🔇' : '🔊', {
      fontSize: '10px',
    }).setOrigin(1, 0).setDepth(100).setInteractive({ useHandCursor: true });
    this._muteBtn.on('pointerdown', () => this._toggleMute());

    // Pause button
    this._pauseBtn = this.add.text(W - 18, 16, '⏸', {
      fontSize: '8px',
    }).setOrigin(1, 0).setDepth(100).setInteractive({ useHandCursor: true });
    this._pauseBtn.on('pointerdown', () => {
      const game = this.scene.get('GameScene');
      if (game && game._togglePause) game._togglePause();
    });

    // Fact card zone — bottom left
    this._factCard = null;

    // Listen to GameScene events
    const game = this.scene.get('GameScene');
    if (game) {
      game.events.on('score-update', (score) => this._onScoreUpdate(score));
      game.events.on('life-lost',    (lives) => this._onLifeLost(lives));
      game.events.on('pup-collected',()       => this._onPupCollected());
      game.events.on('show-fact',    (idx)    => this._showFactCard(idx));
    }
  }

  _onScoreUpdate(score) {
    this._score = score;
    this._scoreTxt.setText(score.toString());

    const hs = parseInt(localStorage.getItem('bimini_highscore') || '0');
    if (score > hs && score > 0) {
      this._hsTxt.setText('NEW BEST!');
      this._hsTxt.setAlpha(1);
      this.tweens.add({ targets: this._hsTxt, alpha: 0.4, duration: 500, yoyo: true, repeat: -1 });
    }
  }

  _onLifeLost(lives) {
    this._lives = lives;
    for (let i = 0; i < MAX_LIVES; i++) {
      const key = i < lives ? 'life-icon' : 'life-grey';
      this._lifeIcons[i].setTexture(key);
    }
  }

  _onPupCollected() {
    // Flash the score golden
    this.tweens.add({
      targets: this._scoreTxt,
      scaleX: 1.4, scaleY: 1.4,
      duration: 200, yoyo: true,
    });
    this._scoreTxt.setColor('#f5c842');
    this.time.delayedCall(600, () => this._scoreTxt.setColor('#52b788'));
  }

  _showFactCard(idx) {
    if (this._factCard) {
      this._factCard.forEach(o => o.destroy());
      this._factCard = null;
    }

    const fact = SHARK_FACTS[idx];
    const x = -200;
    const y = this.scale.height - 70;

    const bg = this.add.rectangle(x + 95, y + 30, 190, 65, 0x05172e, 0.88).setDepth(200);
    const shark = this.add.text(x + 8, y + 6, '🦈', { fontSize: '10px' }).setDepth(201);
    const txt = this.add.text(x + 22, y + 4, fact, {
      fontFamily: '"Press Start 2P"',
      fontSize: '4px',
      color: '#7ec8e3',
      wordWrap: { width: 165 },
      lineSpacing: 4,
    }).setDepth(201);

    this._factCard = [bg, shark, txt];

    // Slide in
    this.tweens.add({
      targets: [bg, shark, txt],
      x: '+=' + 200,
      duration: 400,
      ease: 'Back.easeOut',
    });

    // Slide out after 4 seconds
    this.time.delayedCall(4000, () => {
      if (!this._factCard) return;
      this.tweens.add({
        targets: this._factCard,
        x: '-=200',
        duration: 300,
        ease: 'Back.easeIn',
        onComplete: () => {
          if (this._factCard) {
            this._factCard.forEach(o => o.destroy());
            this._factCard = null;
          }
        },
      });
    });
  }

  _toggleMute() {
    this._muted = !this._muted;
    Audio.setMuted(this._muted);
    this._muteBtn.setText(this._muted ? '🔇' : '🔊');
    if (!this._muted) Audio.startAmbient();
  }
}
