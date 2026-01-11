import { Vector2 } from '../types/index.ts';

export class InputSystem {
  private keys: Record<string, boolean> = { w: false, a: false, s: false, d: false };
  private mouse = { x: 0, y: 0, down: false };
  private targetPos: Vector2 | null = null;
  private canvas: HTMLCanvasElement;
  private onRestart?: () => void;

  constructor(canvas: HTMLCanvasElement, onRestart?: () => void) {
    this.canvas = canvas;
    this.onRestart = onRestart;
    this.setupListeners();
  }

  private setupListeners(): void {
    // Keyboard
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in this.keys) this.keys[key] = true;
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in this.keys) this.keys[key] = false;
    });

    // Mouse
    this.canvas.addEventListener('mousedown', (e: MouseEvent) => {
      if (this.onRestart) {
        this.onRestart();
      }
      this.mouse.down = true;
      this.updateMousePosition(e);
    });

    this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
      this.updateMousePosition(e);
    });

    this.canvas.addEventListener('mouseup', () => {
      this.mouse.down = false;
    });

    // Touch
    this.canvas.addEventListener('touchstart', (e: TouchEvent) => {
      e.preventDefault();
      if (this.onRestart) {
        this.onRestart();
      }
      const touch = e.touches[0];
      this.updateTouchPosition(touch);
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.updateTouchPosition(touch);
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e: TouchEvent) => {
      e.preventDefault();
      this.targetPos = null;
    }, { passive: false });
  }

  private updateMousePosition(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    this.mouse.y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
  }

  private updateTouchPosition(touch: Touch): void {
    const rect = this.canvas.getBoundingClientRect();
    this.targetPos = {
      x: (touch.clientX - rect.left) * (this.canvas.width / rect.width),
      y: (touch.clientY - rect.top) * (this.canvas.height / rect.height)
    };
  }

  getMovementVelocity(speed: number): Vector2 {
    const vel: Vector2 = { x: 0, y: 0 };

    // Keyboard movement
    if (this.keys.w) vel.y = -speed;
    else if (this.keys.s) vel.y = speed;

    if (this.keys.a) vel.x = -speed;
    else if (this.keys.d) vel.x = speed;

    return vel;
  }

  getTargetPosition(): Vector2 | null {
    return this.targetPos;
  }
}
