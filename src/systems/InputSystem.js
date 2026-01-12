/**
 * @typedef {import('../types/index.js').Vector2} Vector2
 */

export class InputSystem {
  constructor(canvas, onRestart) {
    this.canvas = canvas;
    this.onRestart = onRestart;
    this.keys = { w: false, a: false, s: false, d: false };
    this.mouse = { x: 0, y: 0, down: false };
    this.targetPos = null;
    this.setupListeners();
  }

  setupListeners() {
    // Keyboard
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (key in this.keys) this.keys[key] = true;
    });

    window.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      if (key in this.keys) this.keys[key] = false;
    });

    // Mouse
    this.canvas.addEventListener('mousedown', (e) => {
      if (this.onRestart) {
        this.onRestart();
      }
      this.mouse.down = true;
      this.updateMousePosition(e);
    });

    this.canvas.addEventListener('mousemove', (e) => {
      this.updateMousePosition(e);
    });

    this.canvas.addEventListener('mouseup', () => {
      this.mouse.down = false;
    });

    // Touch
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (this.onRestart) {
        this.onRestart();
      }
      const touch = e.touches[0];
      this.updateTouchPosition(touch);
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.updateTouchPosition(touch);
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.targetPos = null;
    }, { passive: false });
  }

  updateMousePosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    this.mouse.y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
  }

  updateTouchPosition(touch) {
    const rect = this.canvas.getBoundingClientRect();
    this.targetPos = {
      x: (touch.clientX - rect.left) * (this.canvas.width / rect.width),
      y: (touch.clientY - rect.top) * (this.canvas.height / rect.height)
    };
  }

  getMovementVelocity(speed) {
    const vel = { x: 0, y: 0 };

    // Keyboard movement
    if (this.keys.w) vel.y = -speed;
    else if (this.keys.s) vel.y = speed;

    if (this.keys.a) vel.x = -speed;
    else if (this.keys.d) vel.x = speed;

    return vel;
  }

  getTargetPosition() {
    return this.targetPos;
  }
}
