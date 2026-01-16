/**
 * @typedef {import('../types/index.js').Vector2} Vector2
 */

export class InputSystem {
  constructor(canvas, onRestart, onCurrencyTap) {
    this.canvas = canvas;
    this.onRestart = onRestart;
    this.onCurrencyTap = onCurrencyTap;
    this.keys = { w: false, a: false, s: false, d: false };
    this.mouse = { x: 0, y: 0, down: false };
    this.targetPos = null;
    this.touchStartPos = null;
    this.touchStartTime = 0;
    this.TAP_THRESHOLD_DISTANCE = 10; // Maximum distance for tap vs drag
    this.TAP_THRESHOLD_TIME = 300; // Maximum time in ms for tap
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
      
      // Try to collect currency on click
      if (this.onCurrencyTap && this.onCurrencyTap(this.mouse.x, this.mouse.y)) {
        // Currency was collected, don't set as movement target
        return;
      }
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
      const rect = this.canvas.getBoundingClientRect();
      const touchX = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
      const touchY = (touch.clientY - rect.top) * (this.canvas.height / rect.height);
      
      // Store touch start info for tap detection
      this.touchStartPos = { x: touchX, y: touchY };
      this.touchStartTime = Date.now();
      
      this.updateTouchPosition(touch);
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.updateTouchPosition(touch);
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      
      // Check if this was a tap (not a drag)
      if (this.touchStartPos && this.onCurrencyTap) {
        const touchDuration = Date.now() - this.touchStartTime;
        
        // Calculate distance moved during touch
        // If targetPos is set, it means touchmove was called
        let dist = 0;
        if (this.targetPos) {
          const dx = this.targetPos.x - this.touchStartPos.x;
          const dy = this.targetPos.y - this.touchStartPos.y;
          dist = Math.sqrt(dx * dx + dy * dy);
        }
        
        // If it was a quick tap with minimal movement, try to collect currency
        if (touchDuration < this.TAP_THRESHOLD_TIME && dist < this.TAP_THRESHOLD_DISTANCE) {
          this.onCurrencyTap(this.touchStartPos.x, this.touchStartPos.y);
        }
      }
      
      this.targetPos = null;
      this.touchStartPos = null;
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
