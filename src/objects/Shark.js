// Shark.js — Player shark class

export default class Shark extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 80, 135, 'shark', 0);
    scene.add.existing(this);
    this.setOrigin(0.5, 0.5);

    // Physics via manual velocity (no arcade physics to keep it simple)
    this.vy = 0;
    this.accelUp = -280;
    this.gravity = 120;
    this.maxVyUp = -200;
    this.maxVyDown = 180;
    this.topBound = 8;
    this.bottomBound = 262;

    // Hitbox (logical, used for overlap checks externally)
    this.hitW = 24;
    this.hitH = 12;

    // State
    this.alive = true;
    this.invincible = false;
    this.invincibleTimer = 0;
    this.flashCount = 0;

    // Swim animation (guard against duplicate creation on restart)
    if (!scene.anims.exists('swim')) {
      scene.anims.create({
        key: 'swim',
        frames: scene.anims.generateFrameNumbers('shark', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1,
      });
    }
    this.play('swim');
  }

  startInvincibility() {
    this.invincible = true;
    this.flashCount = 0;
    this.scene.time.addEvent({
      delay: 90,
      callback: this._flash,
      callbackScope: this,
      repeat: 9,
    });
    this.scene.time.delayedCall(900, () => {
      this.invincible = false;
      this.setVisible(true);
      this.setAlpha(1);
    });
  }

  _flash() {
    this.flashCount++;
    this.setVisible(this.flashCount % 2 === 0);
  }

  update(delta, holdUp, holdDown) {
    if (!this.alive) return;

    const dt = delta / 1000;

    if (holdUp) {
      this.vy += this.accelUp * dt;
    } else if (holdDown) {
      this.vy += 120 * dt; // extra push down when holding
    }
    // Gravity always
    this.vy += this.gravity * dt;

    // Neutral drift toward centre when nothing held
    if (!holdUp && !holdDown) {
      const centre = 135;
      const diff = centre - this.y;
      this.vy += diff * 0.5 * dt;
    }

    // Clamp velocity
    this.vy = Phaser.Math.Clamp(this.vy, this.maxVyUp, this.maxVyDown);

    this.y += this.vy * dt;
    this.y = Phaser.Math.Clamp(this.y, this.topBound + 8, this.bottomBound - 8);

    // Slight tilt based on velocity
    this.setAngle(Phaser.Math.Clamp(this.vy * 0.08, -15, 15));
  }

  getHitbox() {
    return {
      x: this.x - this.hitW / 2,
      y: this.y - this.hitH / 2,
      w: this.hitW,
      h: this.hitH,
    };
  }
}
