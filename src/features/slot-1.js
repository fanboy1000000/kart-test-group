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

export default {
  name: 'Slot 1',

  // Runs once when the game starts.
  init(game) {},

  // Runs every frame, after the karts have moved. dt = seconds since the last frame (about 0.016).
  update(game, dt) {},

  // WORLD coordinates (same as kart.x / kart.y), painted on the ground. Boost pads, item boxes, oil slicks.
  drawBelowKarts(ctx, game, viewKart) {},

  // WORLD coordinates, painted on the ground over the hook above. The karts stand on top of it all.
  // Skid marks, shells, sparks, explosions.
  drawAboveKarts(ctx, game, viewKart) {},

  // SCREEN coordinates for one player's half. (0, 0) is its top-left corner, view.width x view.height its size.
  // Lap counters, speedometers, minimaps, countdowns.
  drawHUD(ctx, game, view, viewKart) {},
};
