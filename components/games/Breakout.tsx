'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const W = 480, H = 400;
const PAD_W = 80, PAD_H = 12;
const BALL_R = 6;
const BRICK_ROWS = 5, BRICK_COLS = 8;
const BRICK_W = W / BRICK_COLS - 4, BRICK_H = 18;
const COLORS = ['#e64646', '#ff9800', '#edc22e', '#4caf50', '#00bcd4'];

type Brick = { x: number; y: number; alive: boolean; color: string };

function createBricks(): Brick[] {
  const bricks: Brick[] = [];
  for (let r = 0; r < BRICK_ROWS; r++)
    for (let c = 0; c < BRICK_COLS; c++)
      bricks.push({
        x: c * (BRICK_W + 4) + 2,
        y: r * (BRICK_H + 4) + 40,
        alive: true,
        color: COLORS[r],
      });
  return bricks;
}

export default function Breakout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const stateRef = useRef({
    padX: W / 2 - PAD_W / 2,
    ballX: W / 2, ballY: H - 40,
    dx: 3, dy: -3,
    bricks: createBricks(),
    score: 0,
    running: true,
  });

  const reset = useCallback(() => {
    stateRef.current = {
      padX: W / 2 - PAD_W / 2,
      ballX: W / 2, ballY: H - 40,
      dx: 3, dy: -3,
      bricks: createBricks(),
      score: 0,
      running: true,
    };
    setScore(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      stateRef.current.padX = Math.min(
        Math.max((e.clientX - rect.left) * scaleX - PAD_W / 2, 0),
        W - PAD_W
      );
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.key === 'ArrowLeft') s.padX = Math.max(s.padX - 30, 0);
      if (e.key === 'ArrowRight') s.padX = Math.min(s.padX + 30, W - PAD_W);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;

    const loop = () => {
      const s = stateRef.current;
      if (!s.running) { raf = requestAnimationFrame(loop); return; }

      s.ballX += s.dx;
      s.ballY += s.dy;

      if (s.ballX <= BALL_R || s.ballX >= W - BALL_R) s.dx = -s.dx;
      if (s.ballY <= BALL_R) s.dy = -s.dy;

      if (
        s.ballY + BALL_R >= H - PAD_H &&
        s.ballX >= s.padX &&
        s.ballX <= s.padX + PAD_W
      ) {
        s.dy = -Math.abs(s.dy);
        const hitPos = (s.ballX - s.padX) / PAD_W;
        s.dx = 5 * (hitPos - 0.5);
      }

      if (s.ballY > H) {
        s.running = false;
        setGameOver(true);
      }

      for (const brick of s.bricks) {
        if (!brick.alive) continue;
        if (
          s.ballX + BALL_R > brick.x &&
          s.ballX - BALL_R < brick.x + BRICK_W &&
          s.ballY + BALL_R > brick.y &&
          s.ballY - BALL_R < brick.y + BRICK_H
        ) {
          brick.alive = false;
          s.dy = -s.dy;
          s.score += 10;
          setScore(s.score);
        }
      }

      if (s.bricks.every((b) => !b.alive)) {
        s.running = false;
        setGameOver(true);
      }

      ctx.fillStyle = '#0f0f13';
      ctx.fillRect(0, 0, W, H);

      for (const brick of s.bricks) {
        if (!brick.alive) continue;
        ctx.fillStyle = brick.color;
        ctx.beginPath();
        ctx.roundRect(brick.x, brick.y, BRICK_W, BRICK_H, 3);
        ctx.fill();
      }

      ctx.fillStyle = '#6c5ce7';
      ctx.beginPath();
      ctx.roundRect(s.padX, H - PAD_H, PAD_W, PAD_H, 4);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(s.ballX, s.ballY, BALL_R, 0, Math.PI * 2);
      ctx.fill();

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
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ borderRadius: 8, border: '2px solid var(--border)', maxWidth: '100%', cursor: 'none' }}
      />
      {gameOver && (
        <div style={{ marginTop: 12, padding: 12, background: score > 0 && stateRef.current.bricks.every(b => !b.alive) ? '#4caf5022' : '#e6464622', borderRadius: 8, color: stateRef.current.bricks.every(b => !b.alive) ? '#4caf50' : '#e64646', fontWeight: 600 }}>
          {stateRef.current.bricks.every(b => !b.alive) ? 'You Win!' : 'Game Over!'} Score: {score}
        </div>
      )}
    </div>
  );
}
