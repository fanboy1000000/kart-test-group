// Entry point: creates the track, the two karts and the game loop, and draws the split screen.
//
// You should not need to edit this file during the hackathon.
// Build your feature in your own file: src/features/slot-N.js

import { Track } from './track.js';
import { Kart } from './kart.js';
import { Input, PLAYER_1_KEYS, PLAYER_2_KEYS } from './input.js';
import { drawView } from './camera.js';
import features from './features/index.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const track = new Track();
const input = new Input();

// Two karts side by side, just behind the start line. Player 1 on the inside, Player 2 on the outside.
const karts = [
  new Kart({
    name: 'Player 1', color: '#e53935', keys: PLAYER_1_KEYS,
    x: track.startX - 40, y: track.startY + 40, angle: track.startAngle,
  }),
  new Kart({
    name: 'Player 2', color: '#1e88e5', keys: PLAYER_2_KEYS,
    x: track.startX + 40, y: track.startY + 40, angle: track.startAngle,
  }),
];

// The game object is handed to every feature hook. Features may add their own properties to it.
const game = { canvas, ctx, track, karts, input, features, time: 0 };
window.game = game; // handy for poking around in the browser console

for (const f of features) f.init?.(game);

let last = performance.now();

function frame(now) {
  // dt = seconds since the last frame, capped so a paused tab does not teleport the karts
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  game.time += dt;

  // --- Update ---
  for (const kart of karts) kart.update(dt, input, track);
  for (const f of features) f.update?.(game, dt);

  // --- Draw: Player 1 on the left, Player 2 on the right ---
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const half = canvas.width / 2;
  drawView(game, karts[0], { x: 0, y: 0, width: half, height: canvas.height });
  drawView(game, karts[1], { x: half, y: 0, width: half, height: canvas.height });

  // divider between the two screens
  ctx.fillStyle = '#111';
  ctx.fillRect(half - 2, 0, 4, canvas.height);

  input.endFrame();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
