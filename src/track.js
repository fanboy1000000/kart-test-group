// The track: a circular ring of asphalt on a field of grass.
//
// World coordinates: the track is centred on (0, 0). Karts drive COUNTER-CLOCKWISE as seen on a
// north-up map, starting on the east side of the ring and heading north.
//
// Helpers you can use from a feature:
//   track.isOnTrack(x, y)           -> true when the point is on the asphalt
//   track.progressOf(x, y)          -> 0..1: how far around the lap this point is (0 = start line)
//   track.pointAt(progress, lane)   -> {x, y} on the track. lane 0 = middle, negative = inner, positive = outer
//   track.directionAt(progress)     -> the angle (radians) a kart faces when driving forwards at that point
//   track.distanceFromCenter(x, y)  -> radius of the point

const TAU = Math.PI * 2;

export class Track {
  constructor() {
    this.centerRadius = 450;   // from the centre of the map to the middle of the asphalt
    this.width = 200;          // width of the asphalt
    this.innerRadius = this.centerRadius - this.width / 2;
    this.outerRadius = this.centerRadius + this.width / 2;

    // Start line is on the east side. Karts start facing north (= forwards around the ring).
    this.startX = this.centerRadius;
    this.startY = 0;
    this.startAngle = -Math.PI / 2;

    this.trees = makeTrees(this);
  }

  distanceFromCenter(x, y) {
    return Math.hypot(x, y);
  }

  isOnTrack(x, y) {
    const d = this.distanceFromCenter(x, y);
    return d >= this.innerRadius && d <= this.outerRadius;
  }

  progressOf(x, y) {
    let p = -Math.atan2(y, x) / TAU;
    if (p < 0) p += 1;
    return p;
  }

  pointAt(progress, lane = 0) {
    const a = -progress * TAU;
    const r = this.centerRadius + lane;
    return { x: Math.cos(a) * r, y: Math.sin(a) * r };
  }

  directionAt(progress) {
    return -progress * TAU - Math.PI / 2;
  }

  // Draws the track flat, in world coordinates. The chase camera draws the trees itself (standing up),
  // so it asks for the ground without them: track.draw(ctx, { trees: false }).
  draw(ctx, { trees = true } = {}) {
    // grass
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(-4000, -4000, 8000, 8000);

    // trees, so you can see that you are moving
    if (trees) {
      for (const t of this.trees) {
        ctx.fillStyle = '#2e7d32';
        ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, TAU); ctx.fill();
        ctx.fillStyle = '#43a047';
        ctx.beginPath(); ctx.arc(t.x - t.r * 0.25, t.y - t.r * 0.25, t.r * 0.5, 0, TAU); ctx.fill();
      }
    }

    // asphalt ring
    ctx.strokeStyle = '#555';
    ctx.lineWidth = this.width;
    ctx.beginPath(); ctx.arc(0, 0, this.centerRadius, 0, TAU); ctx.stroke();

    // red/white curbs on both edges
    for (const r of [this.innerRadius, this.outerRadius]) {
      ctx.lineWidth = 12;
      ctx.setLineDash([]);
      ctx.strokeStyle = '#eeeeee';
      ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke();
      ctx.setLineDash([30, 30]);
      ctx.strokeStyle = '#d32f2f';
      ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke();
    }

    // faint dashed centre line
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.setLineDash([40, 40]);
    ctx.beginPath(); ctx.arc(0, 0, this.centerRadius, 0, TAU); ctx.stroke();
    ctx.setLineDash([]);

    // chequered start/finish line across the track on the east side
    const square = 10;
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < this.width / square; col++) {
        ctx.fillStyle = (row + col) % 2 === 0 ? '#ffffff' : '#111111';
        ctx.fillRect(this.innerRadius + col * square, -square + row * square, square, square);
      }
    }
  }
}

function makeTrees(track) {
  // Deterministic "random" numbers so both players (and every reload) see the same trees.
  let seed = 42;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const trees = [];
  for (let i = 0; i < 25; i++) { // infield
    const a = rand() * TAU, r = rand() * (track.innerRadius - 80);
    trees.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, r: 18 + rand() * 18 });
  }
  for (let i = 0; i < 90; i++) { // outside the track
    const a = rand() * TAU, r = track.outerRadius + 60 + rand() * 700;
    trees.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, r: 18 + rand() * 22 });
  }
  return trees;
}
