// Collectible.js — Fish, jellyfish, pup, and whale shark collectibles

const FISH_TYPES = [
  { key: 'fish',        points: 10,  weight: 60 },
  { key: 'snapper',     points: 25,  weight: 30 },
  { key: 'jellyfish',   points: 5,   weight: 25 },
  { key: 'pup',         points: 150, weight: 0 }, // spawned manually on timer
  { key: 'whale-shark', points: 500, weight: 0 }, // spawned manually, ultra-rare
];

export class CollectibleGroup {
  constructor(scene) {
    this.scene = scene;
    this.collectibles = [];
    this.pupTimer = 0;
    this.PUP_INTERVAL = 90000;         // 90 seconds between pups
    this.whaleSharkTimer = 0;
    this.WHALE_SHARK_INTERVAL = 180000; // 3 minutes between whale sharks
  }

  spawnBetweenObstacles(scrollSpeed) {
    const x = 490 + Math.random() * 30;
    const y = 30 + Math.random() * 210;
    const roll = Math.random() * 115;
    let type;
    let cumulative = 0;
    for (const t of FISH_TYPES.slice(0, -1)) { // exclude pup from random pool
      cumulative += t.weight;
      if (roll < cumulative) { type = t; break; }
    }
    if (!type) type = FISH_TYPES[0];
    this._spawn(type, x, y, scrollSpeed);
  }

  spawnPup(scrollSpeed) {
    const x = 500;
    const y = 60 + Math.random() * 150;
    this._spawn(FISH_TYPES[3], x, y, scrollSpeed);
  }

  spawnWhaleShark(scrollSpeed) {
    const x = 520;
    const y = 50 + Math.random() * 130;
    this._spawn(FISH_TYPES[4], x, y, scrollSpeed);
  }

  _spawn(typeObj, x, y, scrollSpeed) {
    const scene = this.scene;
    const obj = scene.add.sprite(x, y, typeObj.key, 0);
    obj.collectibleType = typeObj.key;
    obj.points = typeObj.points;
    obj.scrollSpeed = scrollSpeed;
    obj.frameTimer = 0;

    // Whale shark is large — scale it up
    if (typeObj.key === 'whale-shark') {
      obj.setScale(1.4);
    }

    // Create anim key if not existing
    const animKey = typeObj.key + '-anim';
    if (!scene.anims.exists(animKey)) {
      const numFrames = { fish: 2, snapper: 2, jellyfish: 2, pup: 2, 'whale-shark': 2 }[typeObj.key] || 1;
      if (numFrames > 1) {
        scene.anims.create({
          key: animKey,
          frames: scene.anims.generateFrameNumbers(typeObj.key, { start: 0, end: numFrames - 1 }),
          frameRate: 4,
          repeat: -1,
        });
      }
    }
    if (scene.anims.exists(animKey)) obj.play(animKey);

    // Gentle bob
    scene.tweens.add({
      targets: obj,
      y: y + 5,
      duration: 800 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.collectibles.push(obj);
  }

  updatePupTimer(delta, scrollSpeed) {
    this.pupTimer += delta;
    if (this.pupTimer >= this.PUP_INTERVAL) {
      this.pupTimer = 0;
      this.spawnPup(scrollSpeed);
    }
    this.whaleSharkTimer += delta;
    if (this.whaleSharkTimer >= this.WHALE_SHARK_INTERVAL) {
      this.whaleSharkTimer = 0;
      this.spawnWhaleShark(scrollSpeed);
    }
  }

  update(delta, scrollSpeed) {
    const dt = delta / 1000;
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const c = this.collectibles[i];
      c.x -= scrollSpeed * dt;
      if (c.x < -30) {
        c.destroy();
        this.collectibles.splice(i, 1);
      }
    }
  }

  checkCollection(sharkHitbox) {
    const collected = [];
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const c = this.collectibles[i];
      const cb = {
        x: c.x - c.displayWidth / 2,
        y: c.y - c.displayHeight / 2,
        w: c.displayWidth,
        h: c.displayHeight,
      };
      if (this._rectsOverlap(sharkHitbox, cb)) {
        collected.push(c);
        this.collectibles.splice(i, 1);
      }
    }
    return collected;
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
    this.collectibles.forEach(c => c.destroy());
    this.collectibles = [];
  }
}
