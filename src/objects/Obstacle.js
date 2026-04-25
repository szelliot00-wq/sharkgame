// Obstacle.js — Human hazards + rival shark species obstacles

export class ObstacleGroup {
  constructor(scene) {
    this.scene = scene;
    this.obstacles = [];
    // Callback fired when a shark obstacle spawns, so GameScene can show a warning
    this.onSharkSpawn = null;
  }

  spawn(scrollSpeed, stage) {
    const types = this._availableTypes(stage);
    const type = Phaser.Utils.Array.GetRandom(types);
    this._spawnType(type, scrollSpeed);
  }

  // Types are repeated for weighting — more repetitions = more common
  _availableTypes(stage) {
    if (stage < 1) return [
      'net', 'net', 'hooks',
      'bull-shark', 'bull-shark', 'bull-shark', 'bull-shark',
      'scuba-diver',
    ];
    if (stage < 2) return [
      'net', 'hooks', 'propeller',
      'bull-shark', 'bull-shark', 'bull-shark', 'bull-shark',
      'scuba-diver', 'scuba-diver',
    ];
    if (stage < 3) return [
      'net', 'hooks', 'propeller',
      'bull-shark', 'bull-shark', 'bull-shark',
      'tiger-shark', 'tiger-shark',
      'scuba-diver', 'scuba-diver', 'scuba-diver',
    ];
    if (stage < 4) return [
      'net', 'hooks', 'net-hook-combo',
      'bull-shark', 'bull-shark', 'bull-shark',
      'tiger-shark', 'tiger-shark', 'tiger-shark',
      'hammerhead', 'hammerhead',
      'scuba-diver', 'scuba-diver', 'scuba-diver',
    ];
    return [
      'net', 'hooks', 'moving-net',
      'bull-shark', 'bull-shark', 'bull-shark',
      'tiger-shark', 'tiger-shark', 'tiger-shark',
      'hammerhead', 'hammerhead', 'hammerhead',
      'scuba-diver', 'scuba-diver', 'scuba-diver', 'scuba-diver',
    ];
  }

  _spawnType(type, scrollSpeed) {
    const scene = this.scene;
    const startX = 510;
    let items = [];

    // ── Human hazards ──────────────────────────────────────────────────────
    if (type === 'net') {
      const gapAtTop = Math.random() > 0.5;
      const y = gapAtTop ? 270 - 32 : 32;
      items.push(this._makeNet(startX, y));

    } else if (type === 'hooks') {
      const numHooks = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < numHooks; i++) {
        const hx = startX + (i - Math.floor(numHooks / 2)) * 20;
        items.push(this._makeHook(hx, 8 + 8));
      }

    } else if (type === 'propeller') {
      const py = 25 + Math.random() * 35;
      items.push(this._makePropeller(startX, py));

    } else if (type === 'net-hook-combo') {
      items.push(this._makeNet(startX, 135));
      for (let i = 0; i < 3; i++) {
        items.push(this._makeHook(startX - 44 - i * 20, 8 + 8));
      }

    } else if (type === 'moving-net') {
      const net = this._makeNet(startX, 135);
      net.moving = true;
      net.movePhase = Math.random() * Math.PI * 2;
      net.moveAmp = 30 + Math.random() * 20;
      net.moveSpeed = 1.5 + Math.random();
      items.push(net);

    // ── Rival shark species ────────────────────────────────────────────────
    } else if (type === 'bull-shark') {
      // Swims straight across — predictable but fast
      const y = 45 + Math.random() * 180;
      const obs = this._makeSharkObstacle('bull-shark', startX, y);
      // Bull sharks move slightly faster than the scroll (aggressive)
      obs.extraSpeed = 20 + Math.random() * 15;
      items.push(obs);
      if (this.onSharkSpawn) this.onSharkSpawn('BULL SHARK');

    } else if (type === 'tiger-shark') {
      // Patrols vertically — sinusoidal, wide sweep
      const y = 80 + Math.random() * 110;
      const obs = this._makeSharkObstacle('tiger-shark', startX, y);
      obs.moving = true;
      obs._baseY = y;
      obs.movePhase = Math.random() * Math.PI * 2;
      obs.moveAmp = 35 + Math.random() * 25;
      obs.moveSpeed = 1.2 + Math.random() * 0.6;
      obs.extraSpeed = 10;
      items.push(obs);
      if (this.onSharkSpawn) this.onSharkSpawn('TIGER SHARK');

    } else if (type === 'hammerhead') {
      // Enters from a diagonal (top or bottom), crosses mid-screen
      const fromTop = Math.random() > 0.5;
      const startY = fromTop ? 20 : 250;
      const obs = this._makeSharkObstacle('hammerhead', startX, startY);
      obs.moving = true;
      obs.movePhase = 0;
      obs.targetY = 135 + (Math.random() - 0.5) * 80;
      obs.approachSpeed = fromTop ? 40 : -40; // px/s vertical drift toward centre
      obs.extraSpeed = 5;
      obs.diagonal = true;
      items.push(obs);
      if (this.onSharkSpawn) this.onSharkSpawn('GREAT HAMMERHEAD');

    } else if (type === 'scuba-diver') {
      // Swims slowly toward the shark — some bob up/down
      const y = 28 + Math.random() * 195;
      const obs = this.scene.add.sprite(startX, y, 'scuba-diver', 0);
      obs.obstacleKind = 'human';
      obs.moving = Math.random() > 0.4; // 60% bob
      obs._baseY = y;
      obs.movePhase = Math.random() * Math.PI * 2;
      obs.moveAmp = 6 + Math.random() * 8;
      obs.moveSpeed = 0.6 + Math.random() * 0.5;
      obs.extraSpeed = 15 + Math.random() * 20; // diver swims toward shark
      obs.diagonal = false;
      obs.setScale(1.4);
      if (!this.scene.anims.exists('diver-kick')) {
        this.scene.anims.create({
          key: 'diver-kick',
          frames: this.scene.anims.generateFrameNumbers('scuba-diver', { start: 0, end: 1 }),
          frameRate: 3,
          repeat: -1,
        });
      }
      obs.play('diver-kick');
      items.push(obs);
    }

    items.forEach(item => {
      item.scrollSpeed = scrollSpeed;
      this.obstacles.push(item);
    });
  }

  // ── Factories ──────────────────────────────────────────────────────────────

  _makeNet(x, y) {
    const obj = this.scene.add.sprite(x, y, 'net', 0);
    obj.obstacleKind = 'human';
    obj.moving = false;
    return obj;
  }

  _makeHook(x, y) {
    const obj = this.scene.add.sprite(x, y, 'hook', 0);
    obj.obstacleKind = 'human';
    obj.moving = false;
    obj.frameTimer = 0;
    return obj;
  }

  _makePropeller(x, y) {
    const obj = this.scene.add.sprite(x, y, 'propeller', 0);
    obj.obstacleKind = 'human';
    obj.moving = false;
    if (!this.scene.anims.exists('spin')) {
      this.scene.anims.create({
        key: 'spin',
        frames: this.scene.anims.generateFrameNumbers('propeller', { start: 0, end: 3 }),
        frameRate: 12,
        repeat: -1,
      });
    }
    obj.play('spin');
    return obj;
  }

  _makeSharkObstacle(key, x, y) {
    const obj = this.scene.add.sprite(x, y, key, 0);
    obj.obstacleKind = 'shark';
    obj.sharkKey = key;
    obj.moving = false;
    obj.diagonal = false;
    obj.extraSpeed = 0;
    // Scale up so they're imposing
    const scales = { 'bull-shark': 2.0, 'tiger-shark': 2.0, 'hammerhead': 1.8 };
    obj.setScale(scales[key] || 1.8);
    // Sharks face left (oncoming) — flip the right-facing sprite
    obj.setFlipX(true);
    // Animate swim cycle
    const animKey = key + '-swim';
    if (!this.scene.anims.exists(animKey)) {
      this.scene.anims.create({
        key: animKey,
        frames: this.scene.anims.generateFrameNumbers(key, { start: 0, end: 1 }),
        frameRate: 5,
        repeat: -1,
      });
    }
    obj.play(animKey);
    return obj;
  }

  // ── Update ────────────────────────────────────────────────────────────────

  update(delta, scrollSpeed) {
    const dt = delta / 1000;

    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      const spd = scrollSpeed + (obs.extraSpeed || 0);
      obs.x -= spd * dt;

      // Moving net / tiger shark vertical sinusoidal
      if (obs.moving && !obs.diagonal) {
        if (!obs._baseY) obs._baseY = obs.y;
        obs.movePhase += obs.moveSpeed * dt;
        obs.y = obs._baseY + Math.sin(obs.movePhase) * obs.moveAmp;
      }

      // Hammerhead diagonal approach
      if (obs.diagonal) {
        const diff = obs.targetY - obs.y;
        if (Math.abs(diff) > 2) {
          obs.y += Math.sign(diff) * Math.min(Math.abs(diff), Math.abs(obs.approachSpeed) * dt * 60);
        }
      }

      // Hook dangle animation
      if (obs.obstacleKind === 'human' && obs.texture && obs.texture.key === 'hook') {
        obs.frameTimer = (obs.frameTimer || 0) + delta;
        if (obs.frameTimer > 400) {
          obs.frameTimer = 0;
          obs.setFrame(obs.frame.name === 0 ? 1 : 0);
        }
      }

      // Destroy when off-screen left
      if (obs.x < -80) {
        obs.destroy();
        this.obstacles.splice(i, 1);
      }
    }
  }

  // ── Collision ─────────────────────────────────────────────────────────────

  checkCollision(sharkHitbox) {
    for (const obs of this.obstacles) {
      const ob = this._hitboxFor(obs);
      if (this._rectsOverlap(sharkHitbox, ob)) return obs;
    }
    return null;
  }

  _hitboxFor(obs) {
    // Sharks get a tighter hitbox (more forgiving for large sprites)
    const shrink = obs.obstacleKind === 'shark' ? 0.55 : 0.65;
    const w = obs.displayWidth  * shrink;
    const h = obs.displayHeight * shrink;
    return { x: obs.x - w / 2, y: obs.y - h / 2, w, h };

  }

  _rectsOverlap(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  clear() {
    this.obstacles.forEach(o => o.destroy());
    this.obstacles = [];
  }
}
