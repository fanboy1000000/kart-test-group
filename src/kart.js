// A kart: position, heading, speed, and the simple arcade physics that move it.
//
// kart.x / kart.y   world coordinates
// kart.angle        heading in radians, same convention as Math.atan2: 0 = east, -PI/2 = north, PI/2 = south
// kart.speed        world units per second, negative when reversing

export class Kart {
  constructor({ name, color, x, y, angle, keys }) {
    this.name = name;
    this.color = color;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = 0;
    this.keys = keys; // which keyboard keys drive this kart (see input.js)

    // size in world units
    this.length = 40;
    this.width = 24;

    // Tuning. Change these to change the feel. Features may change them at runtime (boost, oil slick...).
    this.maxSpeed = 420;
    this.maxReverseSpeed = 150;
    this.offTrackMaxSpeed = 140;
    this.acceleration = 320;
    this.brakeForce = 520;
    this.coastDrag = 1.2;   // how fast the kart slows down when no key is held (higher = faster)
    this.turnSpeed = 2.6;   // radians per second at full grip
  }

  update(dt, input, track) {
    const up = input.isDown(this.keys.up);
    const down = input.isDown(this.keys.down);
    const steer = (input.isDown(this.keys.right) ? 1 : 0) - (input.isDown(this.keys.left) ? 1 : 0);

    // throttle, brake/reverse, or coast
    if (up) this.speed += this.acceleration * dt;
    else if (down) this.speed -= this.brakeForce * dt;
    else this.speed -= this.speed * this.coastDrag * dt;

    // speed limit, much lower on the grass
    const limit = track.isOnTrack(this.x, this.y) ? this.maxSpeed : this.offTrackMaxSpeed;
    if (this.speed > limit) this.speed = Math.max(limit, this.speed - 800 * dt);
    if (this.speed < -this.maxReverseSpeed) this.speed = -this.maxReverseSpeed;

    // steering: nothing when standing still, full effect from about a third of max speed
    const grip = Math.min(Math.abs(this.speed) / (this.maxSpeed / 3), 1);
    const direction = this.speed < 0 ? -1 : 1;
    this.angle += steer * this.turnSpeed * grip * direction * dt;

    // move
    this.x += Math.cos(this.angle) * this.speed * dt;
    this.y += Math.sin(this.angle) * this.speed * dt;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // wheels
    ctx.fillStyle = '#222';
    for (const [wx, wy] of [[-17, -15], [-17, 9], [7, -15], [7, 9]]) ctx.fillRect(wx, wy, 10, 6);

    // body
    ctx.fillStyle = this.color;
    roundedRect(ctx, -this.length / 2, -this.width / 2, this.length, this.width, 7);
    ctx.fill();

    // driver, so you can see which way is forwards
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    roundedRect(ctx, 2, -7, 10, 14, 3);
    ctx.fill();

    ctx.restore();
  }
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
