// Keyboard input. Uses event.code (the physical key), so WASD is in the same place on every keyboard layout.
//
// Key names look like 'KeyW', 'ArrowUp', 'Space', 'ShiftRight', 'KeyP', 'Digit1'.
// Full list: https://developer.mozilla.org/docs/Web/API/UI_Events/Keyboard_event_code_values

export const PLAYER_1_KEYS = { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD', item: 'Space' };
export const PLAYER_2_KEYS = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', item: 'ShiftRight' };

// Keys the browser would otherwise use to scroll the page.
const PREVENT_DEFAULT = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space']);

export class Input {
  constructor() {
    this.held = new Set();
    this.pressedThisFrame = new Set();

    window.addEventListener('keydown', (e) => {
      if (PREVENT_DEFAULT.has(e.code)) e.preventDefault();
      if (e.repeat) return;
      this.held.add(e.code);
      this.pressedThisFrame.add(e.code);
    });
    window.addEventListener('keyup', (e) => this.held.delete(e.code));
    // When the window loses focus we never get the keyup, so release everything.
    window.addEventListener('blur', () => this.held.clear());
  }

  /** True while the key is held down.  Example: input.isDown('KeyW') */
  isDown(code) {
    return this.held.has(code);
  }

  /** True only on the frame the key went down. Good for "use item", "pause", "restart". */
  wasPressed(code) {
    return this.pressedThisFrame.has(code);
  }

  /** Called by main.js at the end of every frame. */
  endFrame() {
    this.pressedThisFrame.clear();
  }
}
