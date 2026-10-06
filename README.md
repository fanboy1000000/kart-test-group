# Kart Hackathon

A two-player, split-screen kart racer that runs in your browser. Plain HTML, JavaScript and a `<canvas>`. No installs, no build step, no frameworks.

This repo is the **starting point**: two karts that can drive around a circular track. Everything else is for you to build today. Laps, items, boosts, a minimap, sound, an AI opponent...

**New here?** Read [INTRODUCTION.md](INTRODUCTION.md) (Danish: [INTRODUKTION.md](INTRODUKTION.md)) for what the day is about and how we work together. **Machine not set up yet?** [SETUP.md](SETUP.md) (Danish: [OPSÆTNING.md](OPSÆTNING.md)) takes you from a blank Windows machine to a running game.

## Run it

1. Open this folder in VS Code.
2. When VS Code suggests the recommended extensions, install them (**Live Server** and **GitHub Pull Requests**).
3. Right-click `index.html` and choose **Open with Live Server**. The game opens in your browser and reloads every time you save a file.

> Double-clicking `index.html` does **not** work. The game is made of JavaScript modules, which browsers only load over `http://`. Live Server gives you that.

## Controls

|                      | Player 1 (left screen) | Player 2 (right screen) |
|----------------------|------------------------|-------------------------|
| Accelerate           | W                      | Up arrow                |
| Brake / reverse      | S                      | Down arrow              |
| Steer                | A / D                  | Left / Right arrow      |
| Item (nothing yet!)  | Space                  | Right Shift             |

Driving on the grass is slow. Stay on the asphalt.

## How the code is organised

```
index.html                the page with the canvas
src/main.js               game loop: update everything, then draw both screens
src/track.js              the circular track, plus helpers like isOnTrack() and progressOf()
src/kart.js               the Kart: position, heading, speed and arcade physics
src/input.js              keyboard handling and the key maps for both players
src/camera.js             draws one player's half: a chase camera behind the kart, Mario Kart style
src/features/index.js     the list of feature slots
src/features/slot-N.js    one file per participant: YOUR feature lives here
src/features/slot-demo.js the group warm-up slot
```

## Your feature slot

Everyone gets **one file**: `src/features/slot-1.js`, `slot-2.js`, and so on. Write your name at the top of yours.

A slot is an object with hooks the game calls for you:

| Hook                                  | When                                   | Use it for                         |
|---------------------------------------|----------------------------------------|------------------------------------|
| `init(game)`                          | once, at start                         | setting things up                  |
| `update(game, dt)`                    | every frame, after the karts moved     | game logic, physics, timers        |
| `drawBelowKarts(ctx, game, viewKart)` | every frame, per screen, on the ground | boost pads, item boxes, oil slicks |
| `drawAboveKarts(ctx, game, viewKart)` | same, painted over the ground items    | skid marks, shells, sparks         |
| `drawHUD(ctx, game, view, viewKart)`  | every frame, per screen, on top        | lap counter, speedometer, minimap  |

The view is a chase camera behind each kart. Whatever you draw in world coordinates is painted on the ground, and the karts and trees stand on top of it. To put something floating at a world position (a name tag over the other kart, say), use `game.camera.project(x, y, height)` inside `drawHUD`; it gives you screen coordinates.

`game` has everything you need: `game.karts` (the two karts), `game.track`, `game.input`, `game.time` and `game.camera`. The comments at the top of your slot file explain each one.

## The rules

1. **Only edit your own slot file**, plus new files you create next to it. Do not touch `main.js`, `track.js`, `kart.js`, `camera.js`, `input.js` or `features/index.js`. If your feature really needs a change there, talk to the team first.
2. **`main` must always run.** Before you merge, reload the game and drive a lap.
3. **Commit often.** Every time something works, commit. See [GIT-CHEATSHEET.md](GIT-CHEATSHEET.md).
4. **Small steps.** Ask your AI assistant for one small thing, reload, check, commit. Repeat.

## Your first feature in five minutes

Let's show each player's speed. In a slot file (the warm-up uses `slot-demo.js`), replace the empty `drawHUD` with:

```js
drawHUD(ctx, game, view, viewKart) {
  const kmh = Math.round(Math.abs(viewKart.speed) / 4);
  ctx.font = 'bold 32px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = 'white';
  ctx.fillText(`${kmh} km/h`, view.width - 20, view.height - 20);
},
```

Save. The game reloads and both screens show a speedometer in the bottom-right corner. That is a feature. Commit it.

## Working with your AI assistant

- Tell it which slot is yours: *"I own `src/features/slot-3.js`. Add a lap counter."*
- The repo contains instructions for the AI (`CLAUDE.md` and `.github/copilot-instructions.md`), so it already knows the rules and the architecture.
- Ask for one thing at a time. If the result is wrong, describe what you saw, not what you expected.
- Ask it to explain anything you do not understand. That is what today is for.
- If the screen goes black, press F12 in the browser, open **Console**, and paste the red error to the assistant.

## What should I build?

Pick from [FEATURES.md](FEATURES.md), or invent your own.
