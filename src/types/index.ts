export interface Vector2 {
  x: number;
  y: number;
}

export interface Circle {
  pos: Vector2;
  vel: Vector2;
  radius: number;
  color: string;
}

export interface Square {
  pos: Vector2;
  vel: Vector2;
  size: number;
  color: string;
  health: number;
}

export interface Triangle {
  pos: Vector2;
  vel: Vector2;
  size: number;
  color: string;
}

export interface GameState {
  player: Circle;
  enemies: Square[];
  projectiles: Triangle[];
  score: number;
  health: number;
  isGameOver: boolean;
  lastEnemySpawn: number;
  lastShot: number;
  targetPos: Vector2 | null;
}
