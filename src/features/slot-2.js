// =====================================================================================
//  FEATURE SLOT 2
//  Owner:    Lauge
//  Feature:  "Hello!" speech bubble above each kart at the start, gone once they drive
// =====================================================================================
//
// This file is YOURS. Nobody else edits it, and you do not edit anyone else's slot.
// Every hook below is optional. Delete the ones you do not use.
// Need more files? Create them next to this one (for example slot-2-sounds.js) and import them here.
//
// `game` gives you:
//   game.karts     the two karts: game.karts[0] drives with WASD, game.karts[1] with the arrows.
//                  A kart has x, y, angle, speed, color, name, keys and tuning fields like maxSpeed.
//   game.track     the track: isOnTrack(x, y), progressOf(x, y), pointAt(progress, lane), directionAt(progress)
//   game.input     the keyboard: input.isDown('Space'), input.wasPressed(kart.keys.item)
//   game.time      seconds since the game started
//   game.ctx       the canvas 2D context, game.canvas the canvas
//   game.camera    game.camera.project(x, y, height) -> screen position of a world point, for use in drawHUD
//
// Drawing hooks run TWICE per frame: once for each player's half of the screen. `viewKart` is the kart
// that half is following. Use it for per-player HUD elements; ignore it for things on the track.

const GREETING = 'Hello!';
const BUBBLE_HEIGHT = 30;   // how high above the ground the bubble floats, in world units
const MOVING_SPEED = 5;     // faster than this counts as "driving" and hides the bubble

export default {
  name: 'Slot 2',

  // Runs once when the game starts: every kart gets a bubble to show.
  init(game) {
    for (const kart of game.karts) {
      kart.slot2ShowBubble = true;
    }
  },

  // Runs every frame, after the karts have moved. Once a kart drives, its bubble is gone for good.
  update(game, dt) {
    for (const kart of game.karts) {
      if (Math.abs(kart.speed) > MOVING_SPEED) {
        kart.slot2ShowBubble = false;
      }
    }
  },

  // WORLD coordinates (same as kart.x / kart.y), painted on the ground. Boost pads, item boxes, oil slicks.
  drawBelowKarts(ctx, game, viewKart) {},

  // WORLD coordinates, painted on the ground over the hook above. The karts stand on top of it all.
  // Skid marks, shells, sparks, explosions.
  drawAboveKarts(ctx, game, viewKart) {},

  // SCREEN coordinates for one player's half. The bubble floats in the air above the kart,
  // so it is drawn here with game.camera.project, which turns a world point into a screen point.
  drawHUD(ctx, game, view, viewKart) {
    for (const kart of game.karts) {
      if (!kart.slot2ShowBubble) continue;

      const point = game.camera.project(kart.x, kart.y, BUBBLE_HEIGHT);
      if (!point.visible) continue;

      drawSpeechBubble(ctx, point.x, point.y, GREETING);
    }
  },
};

// Draws a white rounded box with text, and a small tail pointing down at (x, y).
function drawSpeechBubble(ctx, x, y, text) {
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const padding = 12;
  const boxWidth = ctx.measureText(text).width + padding * 2;
  const boxHeight = 36;
  const tail = 10;
  const left = x - boxWidth / 2;
  const top = y - tail - boxHeight;

  // the box
  ctx.fillStyle = 'white';
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(left, top, boxWidth, boxHeight, 10);
  ctx.fill();
  ctx.stroke();

  // the tail: a small triangle that overlaps the bottom edge of the box, so they look like one shape
  const tailTop = top + boxHeight - 3;
  ctx.beginPath();
  ctx.moveTo(x - tail, tailTop);
  ctx.lineTo(x, y);
  ctx.lineTo(x + tail, tailTop);
  ctx.closePath();
  ctx.fill();
  // outline only the two slanted sides, not the top of the triangle
  ctx.beginPath();
  ctx.moveTo(x - tail, tailTop);
  ctx.lineTo(x, y);
  ctx.lineTo(x + tail, tailTop);
  ctx.stroke();

  // the text
  ctx.fillStyle = '#222';
  ctx.fillText(text, x, top + boxHeight / 2);
}
