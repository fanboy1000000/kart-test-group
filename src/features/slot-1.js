// =====================================================================================
//  FEATURE SLOT 1
//  Owner:    andgaa
//  Feature:  (what are you building?)
// =====================================================================================
//
// This file is YOURS. Nobody else edits it, and you do not edit anyone else's slot.
// Every hook below is optional. Delete the ones you do not use.
// Need more files? Create them next to this one (for example slot-1-sounds.js) and import them here.
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

// Exhaust fumes: a little puff of smoke spawned behind each kart while it drives,
// which grows, fades, and disappears. Puffs stay put once spawned, so as a kart
// drives away it leaves a trail behind it.
let smoke = [];

// One spawn timer per kart (game.karts[0] and [1]), so each kart puffs on its own clock.
let spawnTimers = [0, 0];

export default {
  name: 'Slot 1',

  // Runs once when the game starts.
  init(game) {},

  // Runs every frame, after the karts have moved. dt = seconds since the last frame (about 0.016).
  update(game, dt) {
    game.karts.forEach((kart, i) => {
      spawnTimers[i] += dt;

      // Only smoke while actually moving, and only every 0.05s (not every single frame).
      const moving = Math.abs(kart.speed) > 30;
      if (moving && spawnTimers[i] > 0.05) {
        spawnTimers[i] = 0;

        // The back of the kart is the opposite of the direction it's facing.
        const backX = kart.x - Math.cos(kart.angle) * (kart.length / 2);
        const backY = kart.y - Math.sin(kart.angle) * (kart.length / 2);

        smoke.push({
          x: backX + (Math.random() - 0.5) * 6,
          y: backY + (Math.random() - 0.5) * 6,
          age: 0,
          maxAge: 0.8,
          size: 4 + Math.random() * 3,
        });
      }
    });

    // Age every puff, and drop the ones that have fully faded out.
    for (const puff of smoke) {
      puff.age += dt;
      puff.y -= 8 * dt; // drift gently "up" so it reads as rising smoke
    }
    smoke = smoke.filter((puff) => puff.age < puff.maxAge);
  },

  // WORLD coordinates (same as kart.x / kart.y), painted on the ground. Boost pads, item boxes, oil slicks.
  drawBelowKarts(ctx, game, viewKart) {},

  // WORLD coordinates, painted on the ground over the hook above. The karts stand on top of it all.
  // Skid marks, shells, sparks, explosions.
  drawAboveKarts(ctx, game, viewKart) {
    for (const puff of smoke) {
      const t = puff.age / puff.maxAge; // 0 = just spawned, 1 = about to disappear
      const radius = puff.size + t * 10; // grows over its lifetime
      const alpha = (1 - t) * 0.5; // fades out over its lifetime

      ctx.beginPath();
      ctx.fillStyle = `rgba(120, 120, 120, ${alpha})`;
      ctx.arc(puff.x, puff.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // SCREEN coordinates for one player's half. (0, 0) is its top-left corner, view.width x view.height its size.
  // Lap counters, speedometers, minimaps, countdowns.
  drawHUD(ctx, game, view, viewKart) {},
};
