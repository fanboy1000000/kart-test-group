// Split screen: each player gets half the canvas, drawn by drawView().
//
// The default is a Mario Kart-style CHASE CAMERA: low behind the kart, looking forwards, with the ground
// drawn in perspective. It uses the "Mode 7" trick from the SNES: the world is painted FLAT (top-down) onto
// an offscreen canvas that is lined up with the camera (forwards = up), and that canvas is then copied to
// the screen one row at a time. Each screen row shows a strip of ground a bit further away than the row
// below it, squeezed more the further away it is. That is all the perspective there is.
// Karts and trees are drawn afterwards as sprites that stand up on the ground, far ones first.
//
// Feature hooks do not notice any of this. drawBelowKarts / drawAboveKarts draw in world coordinates
// exactly as before; it just ends up painted on the ground. drawHUD draws in screen coordinates.
// To put something at a world position but floating above the ground (a name tag over a kart, a speech
// bubble), call game.camera.project(x, y, height) from drawHUD. It returns screen coordinates for the
// view that is being drawn: { x, y, scale, visible }. scale is screen pixels per world unit at that spot.
//
// The 3D picture is drawn at RENDER_SCALE of the screen size on its own canvas and scaled up at the end; the
// HUD is drawn on top at full size. Fewer pixels is what keeps it fast on machines without a graphics card.
//
// CHASE_CAMERA = false switches to the old top-down camera. Handy when debugging something on the track.

export const CHASE_CAMERA = true;

// --- Chase camera tuning ---------------------------------------------------------------------------
const CAMERA_HEIGHT = 70;           // how high above the ground the camera floats, in world units
const KART_SCREEN_Y = 0.78;         // where your own kart sits on the screen (fraction of the view height)
const HORIZON_Y = 0.40;             // where the horizon sits (fraction of the view height)
const FIELD_OF_VIEW = 60;           // degrees, left edge to right edge
const DRAW_DISTANCE = 1200;         // ground further away than this disappears into the fog
const FOG_START = 450;              // the fog begins here
const GROUND_PIXELS_PER_UNIT = 1;   // resolution of the offscreen ground canvas. 1.5 is a bit sharper close up, and slower
const RENDER_SCALE = 0.5;           // the 3D picture is drawn at this fraction of the screen size. 1 = full size: sharper, much slower
const RENDER_SMOOTH = false;        // true scales the picture up smoothly instead of with crisp retro pixels: blurrier and slower
const KART_HEIGHT = 8;              // how tall a kart stands, in world units

const SKY_TOP = '#4f9ee8';
const SKY_HORIZON = '#cfe6fb';      // also the fog colour
const HILLS = '#9fcbb3';

// --- Top-down camera tuning (only used when CHASE_CAMERA is false) --------------------------------
export const CAMERA_ROTATES = true; // false = a "north up" camera that follows the kart without rotating
export const ZOOM = 1;              // smaller numbers show more of the track

const TAU = Math.PI * 2;
const FOV = (FIELD_OF_VIEW * Math.PI) / 180;

export function drawView(game, kart, view) {
  if (!CHASE_CAMERA) return drawTopDownView(game, kart, view);

  const { ctx, track, karts, features } = game;

  // The picture canvas: the 3D view, RENDER_SCALE times smaller than the screen. Everything below is in
  // picture pixels until step 4, where the picture is scaled up onto the screen.
  const pic = pictureCanvas(Math.max(1, Math.round(view.width * RENDER_SCALE)), Math.max(1, Math.round(view.height * RENDER_SCALE)));
  const p = pic.ctx;
  const W = pic.canvas.width, H = pic.canvas.height;
  const toScreenX = view.width / W, toScreenY = view.height / H;

  // The camera sits behind the kart and looks the way the kart faces.
  const fx = Math.cos(kart.angle), fy = Math.sin(kart.angle); // forwards, in world coordinates
  const rx = -fy, ry = fx;                                      // to the right
  const focal = (W / 2) / Math.tan(FOV / 2);                    // "lens" in pixels: picture x = focal * lateral / depth
  const horizon = Math.round(H * HORIZON_Y);
  // How far behind the kart the camera must be for the kart to appear at KART_SCREEN_Y.
  const cameraBehind = (focal * CAMERA_HEIGHT) / ((KART_SCREEN_Y - HORIZON_Y) * H);
  const camX = kart.x - fx * cameraBehind, camY = kart.y - fy * cameraBehind;

  // World point -> camera space. depth = how far in front of the camera, lateral = how far to the right.
  const toCamera = (x, y) => {
    const dx = x - camX, dy = y - camY;
    return { depth: dx * fx + dy * fy, lateral: dx * rx + dy * ry };
  };

  game.camera = {
    project(x, y, height = 0) {
      const { depth, lateral } = toCamera(x, y);
      if (depth < 1) return { x: 0, y: 0, scale: 0, visible: false };
      const scale = focal / depth;
      return {
        x: (W / 2 + scale * lateral) * toScreenX,
        y: (horizon + scale * (CAMERA_HEIGHT - height)) * toScreenY,
        scale: scale * toScreenX,
        visible: depth <= DRAW_DISTANCE,
      };
    },
  };

  // --- 1. World pass: paint everything flat onto the ground canvas, lined up with the camera ------
  const k = GROUND_PIXELS_PER_UNIT;
  const { canvas: ground, ctx: g } = groundCanvas();
  const u0 = ground.width / 2, v0 = ground.height; // ground pixel of the camera position; forwards is up
  // No clearing needed: the grass in track.draw() covers the whole ground canvas.
  g.setTransform(k * rx, -k * fx, k * ry, -k * fy, u0 - k * (camX * rx + camY * ry), v0 + k * (camX * fx + camY * fy));
  g.save();
  track.draw(g, { trees: false }); // the trees are drawn standing up, below
  for (const f of features) callDraw(g, f.drawBelowKarts, f, game, kart);
  drawShadows(g, track, karts);
  for (const f of features) callDraw(g, f.drawAboveKarts, f, game, kart);
  g.restore();

  // --- 2. Sky, then the ground canvas copied into the picture row by row -------------------------
  drawSky(p, W, horizon, kart.angle, focal);

  // Picture row y shows the ground at depth focal * CAMERA_HEIGHT / (y - horizon).
  const firstRow = Math.max(horizon + 1, Math.ceil(horizon + (focal * CAMERA_HEIGHT) / DRAW_DISTANCE - 0.5));
  p.fillStyle = SKY_HORIZON;
  p.fillRect(0, horizon, W, firstRow - horizon);
  for (let y = firstRow; y < H; ) {
    // ground pixels covered by one picture row: many near the horizon, a fraction of one near the bottom
    const cover = ((focal * CAMERA_HEIGHT) / (y + 0.5 - horizon) - (focal * CAMERA_HEIGHT) / (y + 1.5 - horizon)) * k;
    const step = cover < 1 ? 2 : 1; // near the bottom two rows show the same ground, so copy once
    const depth = (focal * CAMERA_HEIGHT) / (y + step / 2 - horizon);
    const halfWidth = (W / 2) * depth / focal; // world units visible to each side on this row
    const sh = Math.max(1, cover * step);
    p.drawImage(ground, u0 - halfWidth * k, v0 - depth * k - sh / 2, 2 * halfWidth * k, sh, 0, y, W, step);
    y += step;
  }

  // fog: fades the far rows into the horizon colour
  const fogRow = horizon + (focal * CAMERA_HEIGHT) / FOG_START;
  const fog = p.createLinearGradient(0, horizon, 0, fogRow);
  fog.addColorStop(0, SKY_HORIZON);
  fog.addColorStop(1, 'rgba(207, 230, 251, 0)');
  p.fillStyle = fog;
  p.fillRect(0, horizon, W, fogRow - horizon);

  // --- 3. Sprites: trees and karts standing on the ground, far ones first ------------------------
  const sprites = [];
  for (const tree of track.trees) {
    const c = toCamera(tree.x, tree.y);
    if (c.depth < 10 || c.depth > DRAW_DISTANCE) continue;
    if (Math.abs(c.lateral) > (W / 2) * c.depth / focal + tree.r * 1.5) continue; // off to the side
    sprites.push({ ...c, tree });
  }
  for (const k of karts) {
    const c = toCamera(k.x, k.y);
    if (c.depth < 10 || c.depth > DRAW_DISTANCE) continue;
    sprites.push({ ...c, kart: k });
  }
  sprites.sort((a, b) => b.depth - a.depth);
  for (const sp of sprites) {
    const scale = focal / sp.depth;
    const sx = W / 2 + scale * sp.lateral;
    const sy = horizon + scale * CAMERA_HEIGHT;
    const alpha = 1 - fogAmount(sp.depth);
    if (sp.tree) drawTree(p, sp.tree, sx, sy, scale, alpha);
    else drawKartSprite(p, sp.kart, sx, sy, scale, CAMERA_HEIGHT / sp.depth, rx, ry, fx, fy, alpha);
  }

  // --- 4. The picture goes on the screen, scaled up; then the HUD on top at full size -------------
  ctx.save();
  ctx.imageSmoothingEnabled = RENDER_SMOOTH;
  ctx.drawImage(pic.canvas, 0, 0, W, H, view.x, view.y, view.width, view.height);
  ctx.restore();

  drawHUD(game, kart, view);
}

// --- HUD pass: screen coordinates, (0, 0) = top-left corner of this player's half -----------------
function drawHUD(game, kart, view) {
  const { ctx, features } = game;
  ctx.save();
  ctx.beginPath();
  ctx.rect(view.x, view.y, view.width, view.height);
  ctx.clip();
  ctx.translate(view.x, view.y);

  const hudView = { x: 0, y: 0, width: view.width, height: view.height };
  drawPlayerLabel(ctx, kart);
  for (const f of features) callDraw(ctx, f.drawHUD, f, game, hudView, kart);
  ctx.restore();
}

// Each feature draws inside its own save/restore, so one feature cannot break the others.
function callDraw(ctx, fn, feature, ...args) {
  if (!fn) return;
  ctx.save();
  fn.call(feature, ctx, ...args);
  ctx.restore();
}

function drawPlayerLabel(ctx, kart) {
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(12, 12, ctx.measureText(kart.name).width + 20, 30);
  ctx.fillStyle = kart.color;
  ctx.fillText(kart.name, 22, 18);
}

// --- Chase camera helpers --------------------------------------------------------------------------

// The picture canvas: the 3D view before it is scaled up onto the screen.
let pictureStore = null;
function pictureCanvas(width, height) {
  if (!pictureStore || pictureStore.canvas.width !== width || pictureStore.canvas.height !== height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    pictureStore = { canvas, ctx: canvas.getContext('2d') };
  }
  return pictureStore;
}

// The offscreen ground canvas. Its size depends only on the draw distance, not on the window.
let groundStore = null;
function groundCanvas() {
  if (!groundStore) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(2 * Math.tan(FOV / 2) * DRAW_DISTANCE * GROUND_PIXELS_PER_UNIT) + 4;
    canvas.height = Math.ceil(DRAW_DISTANCE * GROUND_PIXELS_PER_UNIT) + 4;
    groundStore = { canvas, ctx: canvas.getContext('2d') };
  }
  return groundStore;
}

function fogAmount(depth) {
  return Math.min(Math.max((depth - FOG_START) / (DRAW_DISTANCE - FOG_START), 0), 1);
}

let skyStore = null; // the sky gradient, painted once per view size and reused
function drawSky(ctx, W, horizon, heading, focal) {
  if (!skyStore || skyStore.width !== W || skyStore.height !== horizon) {
    skyStore = document.createElement('canvas');
    skyStore.width = W;
    skyStore.height = Math.max(1, horizon);
    const c = skyStore.getContext('2d');
    const sky = c.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, SKY_TOP);
    sky.addColorStop(1, SKY_HORIZON);
    c.fillStyle = sky;
    c.fillRect(0, 0, W, horizon);
  }
  ctx.drawImage(skyStore, 0, 0);

  // distant hills that slide sideways as you turn, so you can feel the rotation
  ctx.fillStyle = HILLS;
  ctx.beginPath();
  ctx.moveTo(0, horizon);
  for (let x = 0; x <= W; x += 4) {
    const a = heading + Math.atan((x - W / 2) / focal); // which compass direction this column looks at
    const h = focal * (0.07 + 0.03 * Math.sin(a * 3) + 0.02 * Math.sin(a * 7 + 1) + 0.012 * Math.sin(a * 13 + 2));
    ctx.lineTo(x, horizon - h);
  }
  ctx.lineTo(W, horizon);
  ctx.closePath();
  ctx.fill();
}

// Painted on the ground, so the sprites look like they stand on it.
function drawShadows(g, track, karts) {
  g.fillStyle = 'rgba(0, 0, 0, 0.25)';
  for (const t of track.trees) {
    g.beginPath();
    g.arc(t.x + t.r * 0.3, t.y + t.r * 0.3, t.r * 0.9, 0, TAU);
    g.fill();
  }
  for (const k of karts) {
    g.save();
    g.translate(k.x, k.y);
    g.rotate(k.angle);
    g.beginPath();
    g.ellipse(2, 2, k.length / 2 + 2, k.width / 2 + 2, 0, 0, TAU);
    g.fill();
    g.restore();
  }
}

function drawTree(ctx, tree, sx, sy, scale, alpha) {
  const r = tree.r;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(sx, sy);
  ctx.scale(scale, scale); // from here on, units are world units; up is negative y
  ctx.fillStyle = '#6d4c41';
  ctx.fillRect(-r * 0.18, -r * 1.2, r * 0.36, r * 1.2);
  ctx.fillStyle = '#2e7d32';
  ctx.beginPath(); ctx.arc(0, -r * 1.8, r, 0, TAU); ctx.fill();
  ctx.fillStyle = '#43a047';
  ctx.beginPath(); ctx.arc(-r * 0.3, -r * 2.1, r * 0.5, 0, TAU); ctx.fill();
  ctx.restore();
}

// A kart is drawn top-down into a small sprite canvas (so a feature that replaces kart.draw still works).
// To make it stand up, darkened copies of that sprite are stacked "forwards" behind it in a second canvas
// and the bright sprite goes on top; the stack is then copied to the screen once, with the same rotation
// and squash as the ground. Forwards on the ground is up on the screen, so it looks like a solid kart.
const SPRITE_RADIUS = 28;    // world units around the kart centre that fit in the sprite (a kart makeover must stay inside this)
const SPRITE_SCALE = 3;      // sprite pixels per world unit
const MAX_STACK_SHIFT = 200; // sprite pixels; keeps the stack canvas small for far-away karts
let spriteStore = null;
function spriteCanvases() {
  if (!spriteStore) {
    const size = SPRITE_RADIUS * SPRITE_SCALE * 2;
    const stackSize = size + 2 * MAX_STACK_SHIFT;
    const make = (n) => { const c = document.createElement('canvas'); c.width = c.height = n; return c; };
    const top = make(size), dark = make(size), stack = make(stackSize);
    spriteStore = {
      size, stackSize, top, dark, stack,
      topCtx: top.getContext('2d'), darkCtx: dark.getContext('2d'), stackCtx: stack.getContext('2d'),
    };
  }
  return spriteStore;
}

function drawKartSprite(ctx, kart, sx, sy, scale, squash, rx, ry, fx, fy, alpha) {
  const { size, stackSize, top, dark, stack, topCtx, darkCtx, stackCtx } = spriteCanvases();

  // 1. paint the kart, top-down, centred in the sprite
  topCtx.setTransform(1, 0, 0, 1, 0, 0);
  topCtx.clearRect(0, 0, size, size);
  topCtx.setTransform(SPRITE_SCALE, 0, 0, SPRITE_SCALE, size / 2, size / 2);
  topCtx.translate(-kart.x, -kart.y);
  kart.draw(topCtx);

  // 2. a darkened copy for the sides
  darkCtx.clearRect(0, 0, size, size);
  darkCtx.drawImage(top, 0, 0);
  darkCtx.globalCompositeOperation = 'source-atop';
  darkCtx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  darkCtx.fillRect(0, 0, size, size);
  darkCtx.globalCompositeOperation = 'source-over';

  // 3. the stack: copies shifted forwards (= up on the screen), about 2 screen pixels apart, bright one last
  const centre = stackSize / 2;
  const shift = Math.min((KART_HEIGHT * SPRITE_SCALE) / squash, MAX_STACK_SHIFT); // sprite pixels that become KART_HEIGHT on screen
  const layers = Math.max(2, Math.ceil((scale * KART_HEIGHT) / 2) + 1);
  const minX = Math.floor(centre - size / 2 + Math.min(0, fx * shift)), maxX = Math.ceil(centre + size / 2 + Math.max(0, fx * shift));
  const minY = Math.floor(centre - size / 2 + Math.min(0, fy * shift)), maxY = Math.ceil(centre + size / 2 + Math.max(0, fy * shift));
  stackCtx.clearRect(minX, minY, maxX - minX, maxY - minY);
  for (let i = 0; i < layers; i++) {
    const t = i / (layers - 1);
    stackCtx.drawImage(t < 1 ? dark : top, Math.round(centre + fx * shift * t - size / 2), Math.round(centre + fy * shift * t - size / 2));
  }

  // 4. one copy to the screen with the ground's rotation and squash; the stack centre lands on the kart
  const m = scale / SPRITE_SCALE;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.transform(m * rx, -m * squash * fx, m * ry, -m * squash * fy, sx, sy);
  ctx.drawImage(stack, minX, minY, maxX - minX, maxY - minY, minX - centre, minY - centre, maxX - minX, maxY - minY);
  ctx.restore();
}

// --- The old top-down camera (CHASE_CAMERA = false) -----------------------------------------------
function drawTopDownView(game, kart, view) {
  const { ctx, track, karts, features } = game;
  const centerY = view.height * (CAMERA_ROTATES ? 0.65 : 0.5); // kart lower down when rotating, to see further ahead
  const rotation = CAMERA_ROTATES ? -Math.PI / 2 - kart.angle : 0;

  game.camera = {
    project(x, y, height = 0) {
      const dx = x - kart.x, dy = y - kart.y;
      const px = dx * Math.cos(rotation) - dy * Math.sin(rotation);
      const py = dx * Math.sin(rotation) + dy * Math.cos(rotation);
      return { x: view.width / 2 + px * ZOOM, y: centerY + (py - height) * ZOOM, scale: ZOOM, visible: true };
    },
  };

  ctx.save();
  ctx.beginPath();
  ctx.rect(view.x, view.y, view.width, view.height);
  ctx.clip();
  ctx.translate(view.x + view.width / 2, view.y + centerY);
  ctx.scale(ZOOM, ZOOM);
  ctx.rotate(rotation);
  ctx.translate(-kart.x, -kart.y);

  track.draw(ctx);
  for (const f of features) callDraw(ctx, f.drawBelowKarts, f, game, kart);
  for (const k of karts) k.draw(ctx);
  for (const f of features) callDraw(ctx, f.drawAboveKarts, f, game, kart);
  ctx.restore();

  drawHUD(game, kart, view);
}
