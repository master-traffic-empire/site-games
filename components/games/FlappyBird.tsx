'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const W = 400, H = 500;
const GRAVITY = 0.4;
const JUMP = -7;
const PIPE_W = 50;
const GAP = 140;
const PIPE_SPEED = 2.5;
const BIRD_SIZE = 24;

type Pipe = { x: number; topH: number; scored?: boolean };

export default function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const stateRef = useRef({
    birdY: H / 2,
    vel: 0,
    pipes: [] as Pipe[],
    score: 0,
    running: false,
    frame: 0,
  });

  const reset = useCallback(() => {
    stateRef.current = {
      birdY: H / 2,
      vel: 0,
      pipes: [],
      score: 0,
      running: true,
      frame: 0,
    };
    setScore(0);
    setGameOver(false);
    setStarted(true);
  }, []);

  const jump = useCallback(() => {
    if (!stateRef.current.running) {
      reset();
      return;
    }
    stateRef.current.vel = JUMP;
  }, [reset]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ') { e.preventDefault(); jump(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [jump]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;

    const loop = () => {
      const s = stateRef.current;
      if (!s.running) {
        raf = requestAnimationFrame(loop);
        return;
      }

      s.vel += GRAVITY;
      s.birdY += s.vel;
      s.frame++;

      if (s.frame % 90 === 0) {
        const topH = 60 + Math.random() * (H - GAP - 120);
        s.pipes.push({ x: W, topH });
      }

      for (const pipe of s.pipes) pipe.x -= PIPE_SPEED;
      s.pipes = s.pipes.filter((p) => p.x > -PIPE_W);

      const bx = 80, by = s.birdY;
      for (const pipe of s.pipes) {
        if (bx + BIRD_SIZE > pipe.x && bx < pipe.x + PIPE_W) {
          if (by < pipe.topH || by + BIRD_SIZE > pipe.topH + GAP) {
            s.running = false;
            setGameOver(true);
          }
        }
        if (!pipe.scored && pipe.x + PIPE_W < bx) {
          pipe.scored = true;
          s.score++;
          setScore(s.score);
        }
      }

      if (s.birdY > H - BIRD_SIZE || s.birdY < 0) {
        s.running = false;
        setGameOver(true);
      }

      ctx.fillStyle = '#0f0f13';
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = '#4caf50';
      for (const pipe of s.pipes) {
        ctx.fillRect(pipe.x, 0, PIPE_W, pipe.topH);
        ctx.fillRect(pipe.x, pipe.topH + GAP, PIPE_W, H - pipe.topH - GAP);
      }

      ctx.fillStyle = '#edc22e';
      ctx.beginPath();
      ctx.arc(bx + BIRD_SIZE / 2, by + BIRD_SIZE / 2, BIRD_SIZE / 2, 0, Math.PI * 2);
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
          {gameOver ? 'Restart' : 'New Game'}
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onClick={jump}
        style={{ borderRadius: 8, border: '2px solid var(--border)', cursor: 'pointer', maxWidth: '100%' }}
      />
      {!started && (
        <p style={{ marginTop: 12, color: 'var(--text-muted)', fontSize: 14 }}>
          Click or press Space to start
        </p>
      )}
      {gameOver && (
        <div style={{ marginTop: 12, padding: 12, background: '#e6464622', borderRadius: 8, color: '#e64646', fontWeight: 600 }}>
          Game Over! Score: {score}
        </div>
      )}
    </div>
  );
}
