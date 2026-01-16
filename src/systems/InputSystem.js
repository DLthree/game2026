/**
 * @typedef {import('../types/index.js').Vector2} Vector2
 */

export class InputSystem {
  // Drag configuration constants
  static MIN_DRAG_DISTANCE = 20; // Minimum drag distance to activate (pixels)
  static MAX_DRAG_DISTANCE = 150; // Maximum effective drag distance (pixels)
  static MIN_SPEED_MULTIPLIER = 0.2; // Minimum speed at MIN_DRAG_DISTANCE (20% of max)
  static MAX_SPEED_MULTIPLIER = 1.0; // Maximum speed at MAX_DRAG_DISTANCE (100% of max)
  
  // Drag line visual constants
  static DRAG_LINE_COLOR = '#00ffff'; // Cyan
  static DRAG_LINE_WIDTH = 3;
  static DRAG_LINE_ENDPOINT_RADIUS = 5;
  
  constructor(canvas, onRestart, onTouchEffect) {
    this.canvas = canvas;
    this.onRestart = onRestart;
    this.onTouchEffect = onTouchEffect;
    this.keys = { w: false, a: false, s: false, d: false };
    this.mouse = { x: 0, y: 0, down: false };
    this.targetPos = null;
    
    // Drag state for visual drag line
    this.dragState = {
      active: false,
      startPos: null,
      currentPos: null
    };
    // Velocity set by last drag (persists after release)
    this.dragVelocity = null;
    
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
      
      // Trigger grid effect at mouse position
      if (this.onTouchEffect) {
        this.onTouchEffect(this.mouse.x, this.mouse.y);
      }
      
      // Initialize drag state for mouse
      this.dragState.active = true;
      this.dragState.startPos = { x: this.mouse.x, y: this.mouse.y };
      this.dragState.currentPos = { x: this.mouse.x, y: this.mouse.y };
    });

    this.canvas.addEventListener('mousemove', (e) => {
      this.updateMousePosition(e);
      
      // Update drag current position if mouse is down
      if (this.mouse.down && this.dragState.active) {
        this.dragState.currentPos = { x: this.mouse.x, y: this.mouse.y };
      }
    });

    this.canvas.addEventListener('mouseup', () => {
      this.mouse.down = false;
      
      // Just clear the visual drag state, keep dragVelocity persisted
      this.dragState.active = false;
      this.dragState.startPos = null;
      this.dragState.currentPos = null;
    });

    // Touch
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (this.onRestart) {
        this.onRestart();
      }
      const touch = e.touches[0];
      const touchPos = this.getTouchCanvasPosition(touch);
      
      // Trigger grid effect at touch position
      if (this.onTouchEffect) {
        this.onTouchEffect(touchPos.x, touchPos.y);
      }
      
      // Initialize drag state
      this.dragState.active = true;
      this.dragState.startPos = { x: touchPos.x, y: touchPos.y };
      this.dragState.currentPos = { x: touchPos.x, y: touchPos.y };
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const touchPos = this.getTouchCanvasPosition(touch);
      
      // Update drag current position
      if (this.dragState.active) {
        this.dragState.currentPos = { x: touchPos.x, y: touchPos.y };
      }
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      
      // Just clear the visual drag state, keep dragVelocity persisted
      this.dragState.active = false;
      this.dragState.startPos = null;
      this.dragState.currentPos = null;
      this.targetPos = null;
    }, { passive: false });
  }

  updateMousePosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    this.mouse.y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
  }

  getTouchCanvasPosition(touch) {
    const rect = this.canvas.getBoundingClientRect();
    return {
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
  
  /**
   * Get drag state for rendering
   * @returns {{ active: boolean, startPos: Vector2|null, currentPos: Vector2|null }}
   */
  getDragState() {
    return this.dragState;
  }
  
  /**
   * Calculate velocity from drag input
   * @param {Vector2} playerPos - Current player position
   * @param {number} maxSpeed - Maximum player speed
   * @returns {{ x: number, y: number }|null} - Velocity vector or null if not dragging
   */
  getDragVelocity(playerPos, maxSpeed) {
    // If actively dragging, calculate real-time velocity
    if (this.dragState.active && this.dragState.startPos && this.dragState.currentPos) {
      const velocity = this._calculateVelocityFromDrag(playerPos, maxSpeed);
      
      // Store velocity for persistence after release
      if (velocity) {
        this.dragVelocity = velocity;
      }
      
      return velocity;
    }
    
    // If not actively dragging, return the persisted velocity from last drag
    return this.dragVelocity;
  }
  
  /**
   * Internal helper to calculate velocity from current drag state
   * @private
   */
  _calculateVelocityFromDrag(playerPos, maxSpeed) {
    // Calculate drag vector from player position to current touch position
    const dx = this.dragState.currentPos.x - playerPos.x;
    const dy = this.dragState.currentPos.y - playerPos.y;
    const dragLength = Math.sqrt(dx * dx + dy * dy);
    
    // Check minimum drag distance
    if (dragLength < InputSystem.MIN_DRAG_DISTANCE) {
      return null;
    }
    
    // Calculate velocity based on drag length (capped at MAX_DRAG_DISTANCE)
    const clampedLength = Math.min(dragLength, InputSystem.MAX_DRAG_DISTANCE);
    const normalizedLength = clampedLength / InputSystem.MAX_DRAG_DISTANCE; // 0 to 1
    const speedRange = InputSystem.MAX_SPEED_MULTIPLIER - InputSystem.MIN_SPEED_MULTIPLIER;
    const speed = maxSpeed * (InputSystem.MIN_SPEED_MULTIPLIER + normalizedLength * speedRange);
    
    // Normalize direction and apply speed
    const velX = (dx / dragLength) * speed;
    const velY = (dy / dragLength) * speed;
    
    return { x: velX, y: velY };
  }
  
  /**
   * Clear the persisted drag velocity (e.g., when player starts using keyboard)
   */
  clearDragVelocity() {
    this.dragVelocity = null;
  }
}
