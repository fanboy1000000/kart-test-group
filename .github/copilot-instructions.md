# Instructions for AI assistants

You are helping a participant in a one-day hackathon. They are **new to building software with AI** and may be new to JavaScript. Optimise for small, working, understandable changes, and explain what you did in plain language.

## The project

- Two-player split-screen kart racer in the browser.
- Plain HTML + JavaScript (ES modules) + Canvas 2D. **No build step, no npm, no frameworks, no TypeScript.** Never add a package.json, bundler or dependency. If a library is truly needed, load it from a CDN with a `<script>` tag, and only if the participant asks for it.
- Runs with VS Code Live Server (ES modules must be served over http). Reloading the browser is the test.

## Architecture

| File | What it does |
|---|---|
| `index.html` | the page with a full-window `<canvas id="game">` |
| `src/main.js` | creates track, karts and the `game` object; game loop: update karts, update features, draw both views |
| `src/track.js` | `Track`: circular ring centred on (0,0), `centerRadius` 450, `width` 200, `innerRadius` 350, `outerRadius` 550. Helpers: `isOnTrack(x,y)`, `progressOf(x,y)` → 0..1 around the lap, `pointAt(progress, lane)` → `{x,y}`, `directionAt(progress)` → heading, `distanceFromCenter(x,y)`. `draw(ctx, { trees = true })` paints it flat; `trees` is an array of `{x, y, r}` |
| `src/kart.js` | `Kart`: `x, y, angle, speed, name, color, keys, length, width`; tuning fields `maxSpeed, maxReverseSpeed, offTrackMaxSpeed, acceleration, brakeForce, coastDrag, turnSpeed`; methods `update(dt, input, track)`, `draw(ctx)` (top-down drawing; a feature may replace it on one kart to restyle that kart, the camera turns it into the standing sprite) |
| `src/input.js` | `Input`: `isDown(code)`, `wasPressed(code)`. Uses `event.code` ('KeyW', 'ArrowUp', 'Space'). `PLAYER_1_KEYS` / `PLAYER_2_KEYS` have `up, down, left, right, item`; item is Space (P1) and ShiftRight (P2) |
| `src/camera.js` | `drawView(game, kart, view)`: Mario Kart-style chase camera (Mode 7). World pass paints track → `drawBelowKarts` → shadows → `drawAboveKarts` flat onto an offscreen ground canvas, which is copied to the screen row by row in perspective; then karts and trees as depth-sorted standing sprites; then the HUD pass. Sets `game.camera.project(x, y, height)` → `{ x, y, scale, visible }` in HUD coordinates for the view being drawn. Tuning constants at the top; `CHASE_CAMERA = false` gives the old top-down view |
| `src/features/index.js` | array of the feature slots, in draw order |
| `src/features/slot-N.js` | one per participant; `slot-demo.js` is the group warm-up |

Conventions:
- World coordinates are the same as `kart.x / kart.y`. Angles are radians in `Math.atan2` convention: 0 = east, `-Math.PI / 2` = north. Karts start on the east side heading north and drive counter-clockwise on a north-up map.
- `dt` is in **seconds** (about 0.016). Speeds are world units per second. `maxSpeed` 420 is about 7 seconds per lap.
- Drawing hooks run once per player view, so twice per frame. World-space drawing must be identical in both views; HUD drawing uses `viewKart` for per-player data. World-space drawing is painted on the ground and shown in perspective; karts and trees stand on top of it. Anything that should float at a world position (a name tag, a speech bubble, a shell in the air) is drawn in `drawHUD` at `game.camera.project(x, y, height)`.
- The `game` object is `{ canvas, ctx, track, karts, input, features, time, camera }`. `game.karts[0]` is Player 1 (WASD), `game.karts[1]` is Player 2 (arrows). It is also `window.game` for console debugging.
- The camera draws every kart in `game.karts`, so a feature may push an extra kart (an AI opponent) into that array. The split screen stays two-player.

## Feature hooks

A slot file exports an object:

```js
export default {
  name: 'Slot 3',
  init(game) {},                           // once at start
  update(game, dt) {},                     // every frame, after karts moved
  drawBelowKarts(ctx, game, viewKart) {},  // world coords, painted on the ground
  drawAboveKarts(ctx, game, viewKart) {},  // world coords, painted on the ground over the previous hook; karts stand on top
  drawHUD(ctx, game, view, viewKart) {},   // screen coords; (0,0) = top-left of this player's half; view.width / view.height
};
```

All hooks are optional. The engine wraps each draw hook in `ctx.save()` / `ctx.restore()`.

## Rules

1. **Each participant owns exactly one `src/features/slot-N.js`.** Edit only that file and new files the participant creates next to it (for example `slot-3-sounds.js`). If you do not know which slot is theirs, ask before editing.
2. **Do not edit** `main.js`, `track.js`, `kart.js`, `camera.js`, `input.js` or `features/index.js`. If a feature truly cannot be done otherwise, say so clearly, propose the smallest possible change, and tell the participant to agree it with their team before merging. The whole team shares those files and a conflict there costs everyone time.
3. **State lives in the feature.** Use module-level variables in the slot file, or add properties to karts or `game` with a feature-specific name (`kart.lapCount`, `game.itemBoxes`), so two features do not clash.
4. **Keep `main` runnable.** Work in small steps that each leave the game working. After each step tell the participant to reload and what to look for.
5. **Explain briefly, in plain language**, what you changed and why. Point at the lines. The participant is here to learn.
6. **Simple over clever.** Plain functions and objects. No classes unless they clearly help. No abstractions for a single use. Code and comments in English.
7. **Suggest a commit** after every working step, on their feature branch (see `GIT-CHEATSHEET.md`).
8. Do not rename, move or reformat files you did not need to change.
9. If the participant reports a black screen, ask for the red line from the browser console (F12) before guessing.
