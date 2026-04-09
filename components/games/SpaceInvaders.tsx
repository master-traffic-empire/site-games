'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const W = 480, H = 500;
const PLAYER_W = 36, PLAYER_H = 20;
const ALIEN_W = 28, ALIEN_H = 20;
const BULLET_W = 3, BULLET_H = 10;
const COLS = 8, ROWS = 4;
const ALIEN_SPEED = 1;

type Alien = { x: number; y: number; alive: boolean };
type Bullet = { x: number; y: number; dy: number };

function createAliens(): Alien[] {
  const aliens: Alien[] = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      aliens.push({ x: 40 + c * 50, y: 40 + r * 36, alive: true });
  return aliens;
}

export default function SpaceInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const stateRef = useRef({
    px: W / 2 - PLAYER_W / 2,
    aliens: createAliens(),
    bullets: [] as Bullet[],
    alienBullets: [] as Bullet[],
    alienDir: 1,
    keys: {} as Record<string, boolean>,
    score: 0,
    frame: 0,
    running: true,
  });

  const reset = useCallback(() => {
    stateRef.current = {
      px: W / 2 - PLAYER_W / 2,
      aliens: createAliens(),
      bullets: [],
      alienBullets: [],
      alienDir: 1,
      keys: {},
      score: 0,
      frame: 0,
      running: true,
    };
    setScore(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      stateRef.current.keys[e.key] = true;
      if (e.key === ' ') e.preventDefault();
    };
    const up = (e: KeyboardEvent) => { stateRef.current.keys[e.key] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let lastShot = 0;

    const loop = () => {
      const s = stateRef.current;
      if (!s.running) { raf = requestAnimationFrame(loop); return; }
      s.frame++;

      if (s.keys['ArrowLeft']) s.px = Math.max(0, s.px - 4);
      if (s.keys['ArrowRight']) s.px = Math.min(W - PLAYER_W, s.px + 4);
      if (s.keys[' '] && s.frame - lastShot > 15) {
        s.bullets.push({ x: s.px + PLAYER_W / 2, y: H - 40, dy: -6 });
        lastShot = s.frame;
      }

      // Move bullets
      s.bullets = s.bullets.filter((b) => { b.y += b.dy; return b.y > 0; });
      s.alienBullets = s.alienBullets.filter((b) => { b.y += b.dy; return b.y < H; });

      // Move aliens
      if (s.frame % 3 === 0) {
        let shift = false;
        for (const a of s.aliens) {
          if (!a.alive) continue;
          if ((a.x + ALIEN_W > W - 10 && s.alienDir > 0) || (a.x < 10 && s.alienDir < 0)) {
            shift = true;
            break;
          }
        }
        if (shift) {
          s.alienDir = -s.alienDir;
          for (const a of s.aliens) if (a.alive) a.y += 12;
        }
        for (const a of s.aliens) if (a.alive) a.x += ALIEN_SPEED * s.alienDir;
      }

      // Alien shooting
      if (s.frame % 60 === 0) {
        const alive = s.aliens.filter((a) => a.alive);
        if (alive.length > 0) {
          const shooter = alive[Math.floor(Math.random() * alive.length)];
          s.alienBullets.push({ x: shooter.x + ALIEN_W / 2, y: shooter.y + ALIEN_H, dy: 3 });
        }
      }

      // Collision: bullets -> aliens
      for (const b of s.bullets) {
        for (const a of s.aliens) {
          if (!a.alive) continue;
          if (b.x > a.x && b.x < a.x + ALIEN_W && b.y > a.y && b.y < a.y + ALIEN_H) {
            a.alive = false;
            b.y = -100;
            s.score += 10;
            setScore(s.score);
          }
        }
      }

      // Collision: alien bullets -> player
      for (const b of s.alienBullets) {
        if (b.x > s.px && b.x < s.px + PLAYER_W && b.y > H - 40 && b.y < H - 20) {
          s.running = false;
          setGameOver(true);
        }
      }

      // Aliens reach bottom
      if (s.aliens.some((a) => a.alive && a.y + ALIEN_H > H - 50)) {
        s.running = false;
        setGameOver(true);
      }

      // All dead
      if (s.aliens.every((a) => !a.alive)) {
        s.aliens = createAliens();
      }

      // Draw
      ctx.fillStyle = '#0f0f13';
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = '#4caf50';
      for (const a of s.aliens) {
        if (!a.alive) continue;
        ctx.fillRect(a.x, a.y, ALIEN_W, ALIEN_H);
      }

      ctx.fillStyle = '#6c5ce7';
      ctx.fillRect(s.px, H - 35, PLAYER_W, PLAYER_H);

      ctx.fillStyle = '#edc22e';
      for (const b of s.bullets) ctx.fillRect(b.x - BULLET_W / 2, b.y, BULLET_W, BULLET_H);

      ctx.fillStyle = '#e64646';
      for (const b of s.alienBullets) ctx.fillRect(b.x - BULLET_W / 2, b.y, BULLET_W, BULLET_H);

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Score: {score}</span>
        <button onClick={reset} style={{ padding: '6px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
          New Game
        </button>
      </div>
      <canvas ref={canvasRef} width={W} height={H} style={{ borderRadius: 8, border: '2px solid var(--border)', maxWidth: '100%' }} />
      {gameOver && (
        <div style={{ marginTop: 12, padding: 12, background: '#e6464622', borderRadius: 8, color: '#e64646', fontWeight: 600 }}>
          Game Over! Score: {score}
        </div>
      )}
    </div>
  );
}
