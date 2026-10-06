# Feature menu

Pick one. Sizes are rough: **S** is about an hour, **M** a couple of hours, **L** fills the afternoon. Start with an S if you have never coded before. You can always pick a second one.

Everything here fits inside your own slot file. Where two features might step on each other, it says so: talk to that person.

## Small

- **Speedometer**: show each player's speed in their HUD. The README walks you through this one.
- **Lap counter**: `track.progressOf(kart.x, kart.y)` goes from 0 to 1 around the lap. When it jumps from above 0.9 to below 0.1, the kart crossed the line forwards. Count it and show "Lap 2" in the HUD. Two traps: the karts *start* just behind the line, so the first crossing starts lap 1 rather than finishing it, and reversing over the line should not count.
- **Race timer**: show `game.time` as `mm:ss.t` in the HUD. Bonus: best lap time (talk to the lap-counter person).
- **Countdown**: "3, 2, 1, GO!" at the start. Hold the karts still by setting `kart.speed = 0` in `update` until the countdown is over.
- **Pause**: `input.wasPressed('KeyP')` toggles a paused flag; while paused set every kart's speed to 0 and draw "PAUSED" across the HUD.
- **Skid marks / trail**: remember the last 100 positions of each kart and draw a faint line through them below the karts.
- **Kart makeover**: a number, a spoiler, a helmet, racing stripes. In `init`, replace the kart's `draw` method with one that calls the original and then draws your extras around `this.x / this.y`, rotated by `this.angle`. The camera builds the standing kart from that drawing, so your extras stand up too (keep them within about 25 units of the kart centre). Exhaust flames when accelerating go on the ground behind the kart, in `drawAboveKarts`.
- **Reset key**: press R to put both karts back on the start line (`track.startX`, `track.startY`, `track.startAngle`).

## Medium

- **Boost pads**: place a few pads with `track.pointAt(progress, lane)`. Draw them below the karts; when a kart is within 30 units, set its speed to 650 for one second. Clashes with the mushroom item: agree who owns "temporary speed boosts".
- **Item boxes and one item**: boxes on the track; driving through one gives the kart an item; `input.wasPressed(kart.keys.item)` uses it. Start with a mushroom (speed boost) or a banana (drop it behind you; whoever drives over it spins).
- **Minimap**: in `drawHUD`, draw a small circle for the track and a dot per kart. Scale world coordinates down by about 0.1 and offset into a corner.
- **Kart collisions**: when the two karts are closer than 30 units, push them apart and swap some speed. Keep it simple: no physics engine.
- **Oil slicks**: puddles on the track that make steering wobble (a random nudge to `kart.angle` each frame) for a second.
- **Drift and mini-turbo**: hold the item key while turning to drift (lower `turnSpeed`, sparks drawn in `drawAboveKarts`); release after a second for a boost.
- **Sound**: engine hum pitched by speed using the Web Audio API, plus a beep at the start. No audio files needed: oscillators are enough. Browsers only start audio after a key press, so start it in `update` on the first key.
- **Finish line**: after 3 laps, stop the race, show the winner on both screens, and offer R to restart. Needs lap counting: build it or pair with that person.
- **Position indicator**: 1st / 2nd in each HUD, from laps and `progressOf`.

## Large

- **AI opponent**: a third kart that follows the track using `track.directionAt(progress)` as its target heading. Create it with `new Kart(...)` imported from `../kart.js`, push it into `game.karts` so the camera draws it, and give it its own driving logic by replacing its `update` method or handing it a fake `input` whose `isDown` returns what the AI "presses". The split screen stays two-player.
- **Homing shell**: an item that chases the other kart and spins it on hit. A dot in `drawAboveKarts` slides along the ground; `game.camera.project(x, y, height)` in `drawHUD` lets it fly.
- **A second track shape**: a figure-eight or oval. This changes `track.js`, which everybody depends on. Only with the whole team's agreement, and ideally as the last merge of the day.
- **Gamepad support**: the Gamepad API mapped onto the existing `kart.keys` scheme.
- **Weather**: rain that lowers grip, with droplets drawn in `drawHUD`.

## Tips

- `game.karts[0]` is Player 1, `game.karts[1]` is Player 2. Loop over `game.karts` so your feature works for both.
- Need something to last one second? Store `game.time + 1` and compare against `game.time` in `update`.
- Need a random position on the track? `track.pointAt(Math.random(), (Math.random() - 0.5) * 160)`.
- Need to know if a kart is on the grass? `!track.isOnTrack(kart.x, kart.y)`.
- Distance between two things: `Math.hypot(a.x - b.x, a.y - b.y)`.
- Drawing in world coordinates: `ctx.arc(x, y, radius, 0, Math.PI * 2)` then `ctx.fill()`. The camera has already positioned everything; it ends up painted on the ground, seen from behind the kart.
- Something floating at a world position (a name tag, a speech bubble): in `drawHUD`, `const p = game.camera.project(kart.x, kart.y, 30);` then draw at `p.x, p.y` if `p.visible`. `p.scale` is how many screen pixels one world unit is there, so far things can be drawn smaller.
