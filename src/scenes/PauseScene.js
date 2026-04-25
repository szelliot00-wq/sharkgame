// PauseScene — overlay while game is paused

import { SHARK_FACTS } from '../data/facts.js';
import { Audio } from '../utils/AudioGenerator.js';

export default class PauseScene extends Phaser.Scene {
  constructor() { super('PauseScene'); }

  init(data) {
    this._score = data.score || 0;
  }

  create() {
    const { width: W, height: H } = this.scale;
    const cx = W / 2;

    // Dark overlay
    this.add.rectangle(0, 0, W, H, 0x000000, 0.75).setOrigin(0).setInteractive();

    this.add.text(cx, 50, 'PAUSED', {
      fontFamily: '"Press Start 2P"',
      fontSize: '18px',
      color: '#f8f9fa',
    }).setOrigin(0.5);

    this.add.text(cx, 80, `Score: ${this._score}`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      color: '#52b788',
    }).setOrigin(0.5);

    // Random fact
    const fact = SHARK_FACTS[Math.floor(Math.random() * 40)];
    this.add.rectangle(cx, 130, 220, 60, 0x05172e, 0.9).setOrigin(0.5);
    this.add.text(cx - 100, 105, '🦈', { fontSize: '10px' });
    this.add.text(cx - 88, 103, fact, {
      fontFamily: '"Press Start 2P"',
      fontSize: '4px',
      color: '#7ec8e3',
      wordWrap: { width: 185 },
      lineSpacing: 4,
    });

    // RESUME
    this._makeButton(cx, 180, 'RESUME', '#52b788', '#1b4332', () => {
      this.scene.stop();
      this.scene.resume('GameScene');
      Audio.startAmbient();
    });

    // QUIT
    this._makeButton(cx, 210, 'QUIT TO MENU', '#e63946', '#2d0a0e', () => {
      Audio.stopAmbient();
      Audio.startMusic();
      this.scene.stop('GameScene');
      this.scene.stop('HUDScene');
      this.scene.stop();
      this.scene.start('TitleScene');
    });

    // Keyboard resume
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.stop();
      this.scene.resume('GameScene');
      Audio.startAmbient();
    });
    this.input.keyboard.once('keydown-ESC', () => {
      this.scene.stop();
      this.scene.resume('GameScene');
      Audio.startAmbient();
    });
  }

  _makeButton(x, y, label, color, bg, onClick) {
    const bgColor = parseInt(bg.replace('#',''), 16);
    const bgRect = this.add.rectangle(x, y, 150, 22, bgColor).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const txt = this.add.text(x, y, label, {
      fontFamily: '"Press Start 2P"',
      fontSize: '7px',
      color,
    }).setOrigin(0.5);
    bgRect.on('pointerover',  () => bgRect.setScale(1.05));
    bgRect.on('pointerout',   () => bgRect.setScale(1));
    bgRect.on('pointerdown',  onClick);
    txt.setInteractive().on('pointerdown', onClick);
  }
}
