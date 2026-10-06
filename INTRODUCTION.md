# Welcome to the kart hackathon

*Read this before the day, or listen when the facilitator reads it aloud at the start. It takes about eight minutes. Danish version: [INTRODUKTION.md](INTRODUKTION.md).*

## What today is

Today you build a video game. Not alone, and not from scratch. Your group starts from a kart game that already runs, and by the end of the day it will have lap counting, a speedometer, items, boost pads, sound, a minimap, or whatever your group decides. Each of you builds one piece of it, and an AI assistant writes the code with you.

Nobody here needs to know how to program. What you need is to say what you want, look at what you got, and decide whether it is right. That is the job today, and it is a real job: it is how a lot of software is being made right now.

## The game

Two players at one keyboard. One drives with W, A, S and D, the other with the arrow keys. Each player has their own half of the screen, seen from behind their kart, like in the kart games you may remember. The track is a circle on a field of grass, and the grass is slow.

That is everything the game does right now. Everything else is on the menu for today: laps, a timer, a countdown, bananas, shells, drifting, an AI opponent that drives on its own. You pick.

## How the game is built, and why you each get a file

The game is made of about a dozen files, of two kinds.

Five of them are the **engine**: the track, the karts and how they drive, the keyboard, the camera, and the loop that runs it all. The engine works already, and nobody edits it today unless the whole group agrees. More on that below.

The rest are **feature files**, one per person: `slot-1.js`, `slot-2.js`, and so on. Each one is an empty plug with a few functions in it: one that runs when the game starts, one that runs every frame, and some that draw. The game runs every slot, every frame, and hands it everything: the karts, the track, the keyboard, the screen. So a feature file can do almost anything. A lap counter lives entirely in one slot: it watches where the karts are and writes "Lap 2" on the screen. It never touches the kart file or the track file.

Your name goes at the top of your slot, and everything you build goes in there. Need more room? Make new files next to it, with your slot's name in front, like `slot-3-sounds.js`. Because your code lives in your own file, you never edit anyone else's, nobody edits yours, and Git never has to choose between two people's work. That is what makes it possible for six people to build the same game at the same time.

If two of you want to work together, share one slot on one machine. One types, the other thinks. Swap now and then.

## How you work with the AI

You open your slot, open the AI chat and tell it what you want. For example: *"I own slot-3.js. Add a lap counter that shows 'Lap 2' in the top right corner."* It writes the code. You save, the game reloads in the browser, you drive, and you look.

Six things worth knowing before you start:

1. **One small thing at a time.** "Add a lap counter" is a good ask. "Add laps, items and sound" is three asks. Do them one by one.
2. **Reloading the game is the test.** If it works on the screen, it works. If it does not, you will see it right away.
3. **Describe what you see, not what you expected.** "The counter says Lap 2 before I cross the line" gives the AI something to work with. "It is wrong" does not.
4. **It sounds confident even when it is wrong.** It will happily write code that does not work and tell you it does. You are the judge, not the AI.
5. **Ask it to explain.** "Why does this line do that?" is always allowed. That is what today is for.
6. **Black screen?** Press F12 in the browser, open **Console**, and paste the red line to the AI. It is usually a one-line fix.

## How you share your work

Sharing goes through GitHub, in a loop you will do a few times today. The words are new, the ideas are not:

- **Branch**: your own private copy of the game to work in. Nothing you do there affects anyone until you say so.
- **Commit**: a saved snapshot with a short note, like "Lap counter shows laps". Do it every time something works.
- **Pull request**: "please add my work to the group's game".
- **Merge**: the button that makes it so.
- **Sync**: fetch everyone's merged work to your own machine, and send yours.

The Git cheat sheet has every click. If Git ever reports a conflict, the cheat sheet says what to do, and a helper can walk you through it in two minutes. With one file per person you should not meet one.

## If you want to change the engine

Sooner or later an idea seems to need a change to the engine: a different track shape, a third player, different controls. Before you touch anything:

1. **Ask the AI whether it can be done inside your slot.** Usually it can. A slot can change a kart's speed, steering and colour, replace how a kart is drawn, add a third kart that drives itself, or draw a whole new thing on the track.
2. **If it really cannot, it is a team decision**, because everybody's game depends on those files. Tell the group what you want to change and why, and agree on it.
3. **Then one person makes the change**, as small as possible, in its own pull request with nothing else in it, and merges it. Everyone else syncs right away, so you are all building on the same engine again.

Changing the engine without telling anyone is the one way to spoil someone else's afternoon today.

## Two features can fight

Git will not complain when two features change the same thing in the game, but the game can still end up confused. A boost pad that sets the kart's speed to 650 and an item that sets it to 420 will fight over the speed every frame. Two features that both reset the karts when you press R will reset them twice.

This is normal, and the fix is a conversation, not a tool:

- **Say what you are building before you build it.** Write it at the top of your slot and tell the group. If two of you want the same thing, talk, and split it or pick something else.
- **Read the feature menu's warnings.** Where two features tend to step on each other, the menu says so.
- **Give your things your own names.** `kart.lapCount` rather than `kart.count`. Ask the AI to do this; it knows what you mean.
- **When the group plays and something behaves oddly**, the two people whose features touch the same thing sort it out between them, each in their own file.

## How to get started

1. Get the game onto your machine and drive a lap. Part 2 of the setup guide, [SETUP.md](SETUP.md), takes you through it step by step.
2. Build the speedometer from the README. It takes five minutes and takes you through the whole loop once: ask the AI, reload, commit, branch, pull request, merge, sync. After that you have done everything you will do today, just smaller.
3. Pick a feature from the menu, or invent one. Tell the group. Write it at the top of your slot.
4. Build it in small steps. Merge it when it works, even if it is not finished. Sync, play, pick the next step.
5. Every hour or two, everyone syncs and the group plays its game together. That is the best moment of the day. Do not skip it.

## The rules

1. **You own one slot file.** You never edit anyone else's, and nobody edits yours.
2. **The engine is shared.** Change it only after the team agrees, in a small pull request of its own, and tell everyone to sync.
3. **Say what you are building.** Before you build it, out loud and at the top of your slot.
4. **The shared game must always run.** Reload and drive a lap before you merge.
5. **Small steps.** One ask of the AI at a time. Reload. Check. Commit when it works.
6. **Stuck for ten minutes? Ask a human.** Helpers are around for exactly this.

## What a good day looks like

You will get stuck at some point. Everyone does. The AI will write something that does not work. It always does, sooner or later. Neither of those means you are doing it wrong; it means you are doing it.

Half a feature that works is a feature. A feature you understand is worth more than one you do not. And the point today is not the game. It is that you go home knowing what it is like to make software with an AI: what to ask for, how to check it, and when to trust it.

Now go and get the game onto your machine.

## Words you will hear today

- **Repo**: the folder with the game, stored on GitHub and copied to your machine.
- **Clone**: copying the repo to your machine, once.
- **Engine**: the five shared files that make the game run. Not yours to edit.
- **Slot**: your feature file. The only file you edit.
- **Reload**: pressing F5 in the browser, or just saving; the game reloads itself.
- **HUD**: the text and gauges drawn on top of the game, like a speedometer.
- **Console**: the panel behind F12 in the browser where errors appear in red.
- **main**: the shared, official version of the game. It must always run.
- **Branch, commit, pull request, merge, sync**: see above. The cheat sheet shows the clicks.
