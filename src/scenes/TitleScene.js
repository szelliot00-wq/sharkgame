// TitleScene — animated title, lazy shark, tap to play

import { Audio } from '../utils/AudioGenerator.js';

export default class TitleScene extends Phaser.Scene {
  constructor() { super('TitleScene'); }

  create() {
    const { width: W, height: H } = this.scale;
    const cx = W / 2;

    // Parallax background
    this._bgDeep   = this.add.tileSprite(0, 0, W, H, 'bg-deep').setOrigin(0).setDepth(0);
    this._bgMid    = this.add.tileSprite(0, 0, W, H, 'bg-mid').setOrigin(0).setDepth(1);
    this._bgMang   = this.add.tileSprite(0, 0, W, H, 'bg-mangrove').setOrigin(0).setDepth(2);
    this._bgSurf   = this.add.tileSprite(0, 0, W, H, 'bg-surface').setOrigin(0).setDepth(3);

    // Lazy shark swims across screen
    this._lazyShark = this.add.sprite(-60, 80 + Math.random() * 60, 'shark', 0).setDepth(4).setScale(1.6);
    if (!this.anims.exists('swim')) {
      this.anims.create({
        key: 'swim',
        frames: this.anims.generateFrameNumbers('shark', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1,
      });
    }
    this._lazyShark.play('swim');

    // Title text with bob
    const title1 = this.add.text(cx, 40, 'LEMON SHARK', {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      color: '#f5c842',
      stroke: '#8a7a3a',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(10);

    const title2 = this.add.text(cx, 60, 'BIMINI RUN', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      color: '#7ec8e3',
      stroke: '#0a2a4a',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(10);

    this.tweens.add({ targets: [title1, title2], y: '-=4', duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // High score
    const hs = localStorage.getItem('bimini_highscore') || 0;
    if (parseInt(hs) > 0) {
      this.add.text(cx, 82, `BEST: ${hs}`, {
        fontFamily: '"Press Start 2P"',
        fontSize: '6px',
        color: '#f5c842',
      }).setOrigin(0.5).setDepth(10);
    }

    // Tap to play — pulsing
    const tapText = this.add.text(cx, 140, 'TAP TO PLAY', {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      color: '#f8f9fa',
    }).setOrigin(0.5).setDepth(10);

    this.tweens.add({ targets: tapText, alpha: 0.2, duration: 700, yoyo: true, repeat: -1 });

    // Space key hint
    this.add.text(cx, 155, 'or SPACE', {
      fontFamily: '"Press Start 2P"',
      fontSize: '5px',
      color: '#7ec8e3',
    }).setOrigin(0.5).setDepth(10);

    // Credit
    this.add.text(cx, 200, 'Based on real research at', {
      fontFamily: '"Press Start 2P"',
      fontSize: '4px',
      color: '#7ec8e3',
    }).setOrigin(0.5).setDepth(10);

    this.add.text(cx, 210, 'Bimini Biological Field Station', {
      fontFamily: '"Press Start 2P"',
      fontSize: '4px',
      color: '#52b788',
    }).setOrigin(0.5).setDepth(10);

    this.add.text(cx, 258, 'Sharks are the heroes 🦈', {
      fontFamily: '"Press Start 2P"',
      fontSize: '4px',
      color: '#f5c842',
    }).setOrigin(0.5).setDepth(10);

    // Controls tutorial overlay
    this._showTutorial();

    // Start music
    Audio.startMusic();

    // Input
    this.input.once('pointerdown', () => this._startGame());
    this.input.keyboard.once('keydown-SPACE', () => this._startGame());
  }

  _showTutorial() {
    const { width: W, height: H } = this.scale;
    const cx = W / 2;
    const seen = localStorage.getItem('bimini_tutorial_seen');
    if (seen) return;

    const overlay = this.add.rectangle(cx, H / 2 + 20, 220, 80, 0x000000, 0.7).setDepth(20);
    const t1 = this.add.text(cx, H / 2 - 10, '👆 Hold TOP → swim up', { fontFamily: '"Press Start 2P"', fontSize: '5px', color: '#7ec8e3' }).setOrigin(0.5).setDepth(21);
    const t2 = this.add.text(cx, H / 2 + 5, '👇 Hold BOTTOM → swim down', { fontFamily: '"Press Start 2P"', fontSize: '5px', color: '#7ec8e3' }).setOrigin(0.5).setDepth(21);
    const t3 = this.add.text(cx, H / 2 + 20, 'Release → drift to centre', { fontFamily: '"Press Start 2P"', fontSize: '5px', color: '#52b788' }).setOrigin(0.5).setDepth(21);
    const t4 = this.add.text(cx, H / 2 + 38, 'Tap anywhere to dismiss', { fontFamily: '"Press Start 2P"', fontSize: '4px', color: '#f8f9fa', alpha: 0.6 }).setOrigin(0.5).setDepth(21);

    this._tutOverlay = [overlay, t1, t2, t3, t4];

    this.time.delayedCall(3000, () => {
      this._tutOverlay.forEach(o => o.destroy());
      localStorage.setItem('bimini_tutorial_seen', '1');
    });
  }

  update() {
    // Scroll parallax background slowly
    this._bgDeep.tilePositionX  += 0.1;
    this._bgMid.tilePositionX   += 0.3;
    this._bgMang.tilePositionX  += 0.6;
    this._bgSurf.tilePositionX  += 1.0;

    // Lazy shark swim
    this._lazyShark.x += 0.4;
    if (this._lazyShark.x > 520) this._lazyShark.x = -50;
  }

  _startGame() {
    Audio.stopMusic();
    this.scene.start('GameScene');
    this.scene.start('HUDScene');
    this.scene.bringToTop('HUDScene');
  }
}
