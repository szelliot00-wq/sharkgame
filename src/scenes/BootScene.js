// BootScene — generates all sprites, shows loading bar, transitions to TitleScene

import { generateAllSprites } from '../utils/SpriteGenerator.js';
import { Audio } from '../utils/AudioGenerator.js';

export default class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  preload() {
    // No external assets — everything is generated.
    // Fake a progress bar while we generate sprites.
    this._createLoadingUI();
  }

  _createLoadingUI() {
    const { width: W, height: H } = this.scale;
    const cx = W / 2;
    const cy = H / 2;

    // Background
    this.add.rectangle(0, 0, W, H, 0x020b18).setOrigin(0, 0);

    // Title
    this.add.text(cx, cy - 60, 'LEMON SHARK', {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      color: '#f5c842',
    }).setOrigin(0.5);

    this.add.text(cx, cy - 40, 'BIMINI RUN', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      color: '#7ec8e3',
    }).setOrigin(0.5);

    this.add.text(cx, cy - 10, 'Loading the reef...', {
      fontFamily: '"Press Start 2P"',
      fontSize: '6px',
      color: '#7ec8e3',
    }).setOrigin(0.5);

    // Progress bar background
    this.add.rectangle(cx, cy + 20, 200, 10, 0x0a2a4a).setOrigin(0.5);
    this._bar = this.add.rectangle(cx - 100, cy + 20, 0, 8, 0x52b788).setOrigin(0, 0.5);

    // Shark icon
    this._sharkX = cx - 110;
    this._sharkText = this.add.text(this._sharkX, cy + 20, '🦈', {
      fontSize: '16px',
    }).setOrigin(0.5);
  }

  create() {
    Audio.init();

    // Generate sprites in steps — use a fake timer to animate the loading bar
    const steps = [
      () => generateAllSprites(this),
    ];

    // Generate all sprites first
    generateAllSprites(this);

    let progress = 0;
    const total = 10;
    const cx = this.scale.width / 2;

    this.time.addEvent({
      delay: 50,
      repeat: total - 1,
      callback: () => {
        progress++;
        const pct = progress / total;
        this._bar.width = 200 * pct;
        this._sharkText.x = (cx - 100) + 200 * pct;

        if (progress >= total) {
          this.time.delayedCall(200, () => {
            this.scene.start('TitleScene');
          });
        }
      },
    });
  }
}
