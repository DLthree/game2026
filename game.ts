interface Vector2 {
    x: number;
    y: number;
}

interface Circle {
    pos: Vector2;
    vel: Vector2;
    radius: number;
    color: string;
}

interface Square {
    pos: Vector2;
    vel: Vector2;
    size: number;
    color: string;
    health: number;
}

interface Triangle {
    pos: Vector2;
    vel: Vector2;
    size: number;
    color: string;
}

// Canvas setup
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const scoreElement = document.getElementById('score') as HTMLElement;
const healthElement = document.getElementById('health') as HTMLElement;
const gameOverElement = document.getElementById('gameOver') as HTMLElement;

// Set canvas size
function resizeCanvas(): void {
    const maxWidth = 800;
    const maxHeight = 600;
    const scale = Math.min(
        window.innerWidth / maxWidth,
        window.innerHeight / maxHeight,
        1
    );
    canvas.width = maxWidth;
    canvas.height = maxHeight;
    canvas.style.width = `${maxWidth * scale}px`;
    canvas.style.height = `${maxHeight * scale}px`;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game state
const game = {
    player: {
        pos: { x: canvas.width / 2, y: canvas.height / 2 },
        vel: { x: 0, y: 0 },
        radius: 15,
        color: '#00ff00'
    } as Circle,
    enemies: [] as Square[],
    projectiles: [] as Triangle[],
    score: 0,
    health: 100,
    isGameOver: false,
    lastEnemySpawn: 0,
    lastShot: 0,
    targetPos: null as Vector2 | null
};

// Input handling
const keys: Record<string, boolean> = { w: false, a: false, s: false, d: false };
const mouse = { x: 0, y: 0, down: false };

// Keyboard
window.addEventListener('keydown', (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (key in keys) keys[key] = true;
});
window.addEventListener('keyup', (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (key in keys) keys[key] = false;
});

// Mouse
canvas.addEventListener('mousedown', (e: MouseEvent) => {
    if (game.isGameOver) {
        restartGame();
        return;
    }
    mouse.down = true;
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
    mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
});
canvas.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
    mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
});
canvas.addEventListener('mouseup', () => { mouse.down = false; });

// Touch
canvas.addEventListener('touchstart', (e: TouchEvent) => {
    e.preventDefault();
    if (game.isGameOver) {
        restartGame();
        return;
    }
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    game.targetPos = {
        x: (touch.clientX - rect.left) * (canvas.width / rect.width),
        y: (touch.clientY - rect.top) * (canvas.height / rect.height)
    };
}, { passive: false });
canvas.addEventListener('touchmove', (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    game.targetPos = {
        x: (touch.clientX - rect.left) * (canvas.width / rect.width),
        y: (touch.clientY - rect.top) * (canvas.height / rect.height)
    };
}, { passive: false });
canvas.addEventListener('touchend', (e: TouchEvent) => {
    e.preventDefault();
    game.targetPos = null;
}, { passive: false });

function restartGame(): void {
    game.player.pos = { x: canvas.width / 2, y: canvas.height / 2 };
    game.player.vel = { x: 0, y: 0 };
    game.enemies = [];
    game.projectiles = [];
    game.score = 0;
    game.health = 100;
    game.isGameOver = false;
    game.lastEnemySpawn = 0;
    game.lastShot = 0;
    gameOverElement.style.display = 'none';
}

// Game logic
function update(dt: number): void {
    if (game.isGameOver) return;

    // Player movement
    const speed = 200;
    if (keys.w) game.player.vel.y = -speed;
    else if (keys.s) game.player.vel.y = speed;
    else game.player.vel.y = 0;
    
    if (keys.a) game.player.vel.x = -speed;
    else if (keys.d) game.player.vel.x = speed;
    else game.player.vel.x = 0;

    // Touch/mouse movement
    if (game.targetPos) {
        const dx = game.targetPos.x - game.player.pos.x;
        const dy = game.targetPos.y - game.player.pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 5) {
            game.player.vel.x = (dx / dist) * speed;
            game.player.vel.y = (dy / dist) * speed;
        } else {
            game.player.vel.x = 0;
            game.player.vel.y = 0;
        }
    }

    // Update player position
    game.player.pos.x += game.player.vel.x * dt;
    game.player.pos.y += game.player.vel.y * dt;

    // Keep player in bounds
    game.player.pos.x = Math.max(game.player.radius, Math.min(canvas.width - game.player.radius, game.player.pos.x));
    game.player.pos.y = Math.max(game.player.radius, Math.min(canvas.height - game.player.radius, game.player.pos.y));

    // Spawn enemies
    const now = Date.now();
    if (now - game.lastEnemySpawn > 1000) {
        game.lastEnemySpawn = now;
        const side = Math.floor(Math.random() * 4);
        let x: number, y: number;
        if (side === 0) { x = -20; y = Math.random() * canvas.height; }
        else if (side === 1) { x = canvas.width + 20; y = Math.random() * canvas.height; }
        else if (side === 2) { x = Math.random() * canvas.width; y = -20; }
        else { x = Math.random() * canvas.width; y = canvas.height + 20; }
        
        game.enemies.push({
            pos: { x, y },
            vel: { x: 0, y: 0 },
            size: 15,
            color: '#ff0000',
            health: 1
        });
    }

    // Update enemies
    for (let i = game.enemies.length - 1; i >= 0; i--) {
        const enemy = game.enemies[i];
        const dx = game.player.pos.x - enemy.pos.x;
        const dy = game.player.pos.y - enemy.pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const enemySpeed = 50;
        enemy.vel.x = (dx / dist) * enemySpeed;
        enemy.vel.y = (dy / dist) * enemySpeed;
        enemy.pos.x += enemy.vel.x * dt;
        enemy.pos.y += enemy.vel.y * dt;

        // Check collision with player
        const collisionDist = game.player.radius + enemy.size;
        if (dist < collisionDist) {
            game.health -= 10;
            game.enemies.splice(i, 1);
            if (game.health <= 0) {
                game.isGameOver = true;
                gameOverElement.style.display = 'block';
            }
        }
    }

    // Auto-shoot projectiles
    if (now - game.lastShot > 500 && game.enemies.length > 0) {
        game.lastShot = now;
        const nearestEnemy = game.enemies.reduce<{ enemy: Square; dist: number } | null>((nearest, enemy) => {
            const dx = enemy.pos.x - game.player.pos.x;
            const dy = enemy.pos.y - game.player.pos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (!nearest || dist < nearest.dist) {
                return { enemy, dist };
            }
            return nearest;
        }, null);

        if (nearestEnemy) {
            const dx = nearestEnemy.enemy.pos.x - game.player.pos.x;
            const dy = nearestEnemy.enemy.pos.y - game.player.pos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const projectileSpeed = 300;
            game.projectiles.push({
                pos: { x: game.player.pos.x, y: game.player.pos.y },
                vel: { x: (dx / dist) * projectileSpeed, y: (dy / dist) * projectileSpeed },
                size: 8,
                color: '#ffff00'
            });
        }
    }

    // Update projectiles
    for (let i = game.projectiles.length - 1; i >= 0; i--) {
        const proj = game.projectiles[i];
        proj.pos.x += proj.vel.x * dt;
        proj.pos.y += proj.vel.y * dt;

        // Remove if out of bounds
        if (proj.pos.x < 0 || proj.pos.x > canvas.width || proj.pos.y < 0 || proj.pos.y > canvas.height) {
            game.projectiles.splice(i, 1);
            continue;
        }

        // Check collision with enemies
        for (let j = game.enemies.length - 1; j >= 0; j--) {
            const enemy = game.enemies[j];
            const dx = proj.pos.x - enemy.pos.x;
            const dy = proj.pos.y - enemy.pos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < proj.size + enemy.size) {
                enemy.health--;
                game.projectiles.splice(i, 1);
                if (enemy.health <= 0) {
                    game.enemies.splice(j, 1);
                    game.score += 10;
                }
                break;
            }
        }
    }

    // Update UI
    scoreElement.textContent = game.score.toString();
    healthElement.textContent = game.health.toString();
}

function draw(): void {
    // Clear
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player (circle)
    ctx.fillStyle = game.player.color;
    ctx.beginPath();
    ctx.arc(game.player.pos.x, game.player.pos.y, game.player.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw enemies (squares)
    for (const enemy of game.enemies) {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(
            enemy.pos.x - enemy.size,
            enemy.pos.y - enemy.size,
            enemy.size * 2,
            enemy.size * 2
        );
    }

    // Draw projectiles (triangles)
    for (const proj of game.projectiles) {
        ctx.fillStyle = proj.color;
        ctx.beginPath();
        const angle = Math.atan2(proj.vel.y, proj.vel.x);
        const size = proj.size;
        ctx.moveTo(
            proj.pos.x + Math.cos(angle) * size,
            proj.pos.y + Math.sin(angle) * size
        );
        ctx.lineTo(
            proj.pos.x + Math.cos(angle + 2.4) * size,
            proj.pos.y + Math.sin(angle + 2.4) * size
        );
        ctx.lineTo(
            proj.pos.x + Math.cos(angle - 2.4) * size,
            proj.pos.y + Math.sin(angle - 2.4) * size
        );
        ctx.closePath();
        ctx.fill();
    }
}

// Game loop
let lastTime = 0;
function gameLoop(timestamp: number): void {
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    if (dt < 0.1) { // Avoid huge delta times
        update(dt);
    }
    draw();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
