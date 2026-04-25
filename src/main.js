import Phaser from 'phaser';
import BootScene     from './scenes/BootScene.js';
import TitleScene    from './scenes/TitleScene.js';
import GameScene     from './scenes/GameScene.js';
import HUDScene      from './scenes/HUDScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import PauseScene    from './scenes/PauseScene.js';

const config = {
  type: Phaser.AUTO,
  width:  480,
  height: 270,
  pixelArt: true,
  antialias: false,
  backgroundColor: '#020b18',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    BootScene,
    TitleScene,
    GameScene,
    HUDScene,
    GameOverScene,
    PauseScene,
  ],
};

new Phaser.Game(config);
