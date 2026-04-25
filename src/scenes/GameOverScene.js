// GameOverScene — score, retry, facts

import { SHARK_FACTS } from '../data/facts.js';
import { Audio } from '../utils/AudioGenerator.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }

  init(data) {
    this._score        = data.score        || 0;
    this._highScore    = data.highScore    || 0;
    this._isNewHighScore = data.isNewHighScore || false;
  }

  create() {
    const { width: W, height: H } = this.scale;
    const cx = W / 2;

    // Dark overlay background
    this.add.rectangle(0, 0, W, H, 0x020b18, 0.92).setOrigin(0);

    // Sad shark sinking
    this._sadShark = this.add.sprite(cx, 30, 'shark', 0).setScale(1.8).setAngle(90).setAlpha(0.7).setTint(0x7ec8e3);
    this.tweens.add({ targets: this._sadShark, y: H + 60, duration: 5000, ease: 'Sine.easeIn' });

    // GAME OVER title
    this.add.text(cx, 40, 'GAME OVER', {
      fontFamily: '"Press Start 2P"',
      fontSize: '16px',
      color: '#e63946',
      stroke: '#8a0010',
      strokeThickness: 2,
    }).setOrigin(0.5);

    // Score
    this.add.text(cx, 75, `SCORE: ${this._score}`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      color: '#52b788',
    }).setOrigin(0.5);

    this.add.text(cx, 90, `BEST:  ${this._highScore}`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      color: '#f5c842',
    }).setOrigin(0.5);

    // New high score!
    if (this._isNewHighScore) {
      const nhsTxt = this.add.text(cx, 105, '★ NEW HIGH SCORE! ★', {
        fontFamily: '"Press Start 2P"',
        fontSize: '7px',
        color: '#f5c842',
      }).setOrigin(0.5);
      this.tweens.add({ targets: nhsTxt, alpha: 0.2, duration: 400, yoyo: true, repeat: -1 });
    }

    // Final fact
    const factIdx = Math.floor(Math.random() * 40);
    const fact = SHARK_FACTS[factIdx];
    const factY = this._isNewHighScore ? 125 : 115;

    this.add.rectangle(cx, factY + 28, 220, 58, 0x05172e, 0.9).setOrigin(0.5);
    this.add.text(cx - 100, factY + 4, '🦈', { fontSize: '10px' });
    this.add.text(cx - 88, factY + 2, fact, {
      fontFamily: '"Press Start 2P"',
      fontSize: '4px',
      color: '#7ec8e3',
      wordWrap: { width: 185 },
      lineSpacing: 4,
    });

    const btnY = factY + 70;

    // PLAY AGAIN button
    this._makeButton(cx, btnY, 'PLAY AGAIN', '#52b788', '#1b4332', () => {
      Audio.stopMusic();
      this.scene.start('GameScene');
      this.scene.start('HUDScene');
      this.scene.bringToTop('HUDScene');
    });

    // MAIN MENU button
    this._makeButton(cx, btnY + 28, 'MAIN MENU', '#7ec8e3', '#0a2a4a', () => {
      Audio.startMusic();
      this.scene.start('TitleScene');
    });

    // Auto-return countdown
    this._countdown = 5;
    const cntTxt = this.add.text(cx, H - 16, `Auto-return in ${this._countdown}s`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '4px',
      color: '#555',
    }).setOrigin(0.5);

    this.time.addEvent({
      delay: 1000,
      repeat: 4,
      callback: () => {
        this._countdown--;
        cntTxt.setText(`Auto-return in ${this._countdown}s`);
        if (this._countdown <= 0) {
          Audio.startMusic();
          this.scene.start('TitleScene');
        }
      },
    });
  }

  _makeButton(x, y, label, color, bg, onClick) {
    const bgColor = parseInt(bg.replace('#',''), 16);
    const btn = this.add.rectangle(x, y, 140, 22, bgColor, 1).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const txt = this.add.text(x, y, label, {
      fontFamily: '"Press Start 2P"',
      fontSize: '7px',
      color,
    }).setOrigin(0.5);

    btn.on('pointerover',  () => { btn.setScale(1.05); txt.setScale(1.05); });
    btn.on('pointerout',   () => { btn.setScale(1);    txt.setScale(1); });
    btn.on('pointerdown',  onClick);
    txt.setInteractive().on('pointerdown', onClick);
  }
}
