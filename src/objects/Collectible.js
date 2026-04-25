// Collectible.js — Fish, jellyfish, and pup collectibles

const FISH_TYPES = [
  { key: 'fish',     points: 10,  weight: 60 },
  { key: 'snapper',  points: 25,  weight: 30 },
  { key: 'jellyfish', points: 5,  weight: 25 },
  { key: 'pup',      points: 150, weight: 0 }, // spawned manually on timer
];

export class CollectibleGroup {
  constructor(scene) {
    this.scene = scene;
    this.collectibles = [];
    this.pupTimer = 0;
    this.PUP_INTERVAL = 90000; // 90 seconds between pups
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

  _spawn(typeObj, x, y, scrollSpeed) {
    const scene = this.scene;
    const obj = scene.add.sprite(x, y, typeObj.key, 0);
    obj.collectibleType = typeObj.key;
    obj.points = typeObj.points;
    obj.scrollSpeed = scrollSpeed;
    obj.frameTimer = 0;

    // Create anim key if not existing
    const animKey = typeObj.key + '-anim';
    if (!scene.anims.exists(animKey)) {
      const numFrames = { fish: 2, snapper: 2, jellyfish: 2, pup: 2 }[typeObj.key] || 1;
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
        x: c.x - c.width / 2,
        y: c.y - c.height / 2,
        w: c.width,
        h: c.height,
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
