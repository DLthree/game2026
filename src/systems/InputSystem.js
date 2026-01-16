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
    
    // Drag state for visual drag line
    this.dragState = {
      active: false,
      startPos: null,
      currentPos: null
    };
    this.MIN_DRAG_DISTANCE = 20; // Minimum drag distance to activate
    this.MAX_DRAG_DISTANCE = 150; // Maximum effective drag distance
    
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
      
      // Clear drag state
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
      
      // Clear drag state
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

  updateTouchPosition(touch) {
    const pos = this.getTouchCanvasPosition(touch);
    this.targetPos = { x: pos.x, y: pos.y };
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
    if (!this.dragState.active || !this.dragState.startPos || !this.dragState.currentPos) {
      return null;
    }
    
    // Calculate drag vector from player position to current touch position
    const dx = this.dragState.currentPos.x - playerPos.x;
    const dy = this.dragState.currentPos.y - playerPos.y;
    const dragLength = Math.sqrt(dx * dx + dy * dy);
    
    // Check minimum drag distance
    if (dragLength < this.MIN_DRAG_DISTANCE) {
      return null;
    }
    
    // Calculate velocity based on drag length (capped at MAX_DRAG_DISTANCE)
    const clampedLength = Math.min(dragLength, this.MAX_DRAG_DISTANCE);
    const speedMultiplier = clampedLength / this.MAX_DRAG_DISTANCE; // 0 to 1
    const speed = maxSpeed * (0.2 + speedMultiplier * 0.8); // 20% to 100% of max speed
    
    // Normalize direction and apply speed
    const velX = (dx / dragLength) * speed;
    const velY = (dy / dragLength) * speed;
    
    return { x: velX, y: velY };
  }
}
