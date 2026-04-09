'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const W = 500, H = 360;
const PAD_W = 10, PAD_H = 70;
const BALL_R = 6;
const PAD_SPEED = 5;
const BALL_SPEED = 4;
const WIN_SCORE = 5;

export default function Pong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scores, setScores] = useState([0, 0]);
  const [winner, setWinner] = useState('');

  const stateRef = useRef({
    p1: H / 2 - PAD_H / 2,
    p2: H / 2 - PAD_H / 2,
    bx: W / 2, by: H / 2,
    bdx: BALL_SPEED, bdy: BALL_SPEED * 0.6,
    keys: {} as Record<string, boolean>,
    scores: [0, 0],
    running: true,
  });

  const resetBall = useCallback(() => {
    const s = stateRef.current;
    s.bx = W / 2;
    s.by = H / 2;
    s.bdx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    s.bdy = BALL_SPEED * 0.6 * (Math.random() > 0.5 ? 1 : -1);
  }, []);

  const reset = useCallback(() => {
    stateRef.current.scores = [0, 0];
    stateRef.current.p1 = H / 2 - PAD_H / 2;
    stateRef.current.p2 = H / 2 - PAD_H / 2;
    stateRef.current.running = true;
    resetBall();
    setScores([0, 0]);
    setWinner('');
  }, [resetBall]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => { stateRef.current.keys[e.key] = true; };
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

    const loop = () => {
      const s = stateRef.current;
      if (!s.running) { raf = requestAnimationFrame(loop); return; }

      if (s.keys['w'] || s.keys['W']) s.p1 = Math.max(0, s.p1 - PAD_SPEED);
      if (s.keys['s'] || s.keys['S']) s.p1 = Math.min(H - PAD_H, s.p1 + PAD_SPEED);

      // AI for player 2
      const p2Center = s.p2 + PAD_H / 2;
      if (p2Center < s.by - 10) s.p2 = Math.min(H - PAD_H, s.p2 + PAD_SPEED * 0.7);
      else if (p2Center > s.by + 10) s.p2 = Math.max(0, s.p2 - PAD_SPEED * 0.7);

      s.bx += s.bdx;
      s.by += s.bdy;

      if (s.by <= BALL_R || s.by >= H - BALL_R) s.bdy = -s.bdy;

      // Left paddle
      if (s.bx - BALL_R <= PAD_W + 10 && s.by >= s.p1 && s.by <= s.p1 + PAD_H) {
        s.bdx = Math.abs(s.bdx);
      }
      // Right paddle
      if (s.bx + BALL_R >= W - PAD_W - 10 && s.by >= s.p2 && s.by <= s.p2 + PAD_H) {
        s.bdx = -Math.abs(s.bdx);
      }

      if (s.bx < 0) {
        s.scores[1]++;
        setScores([...s.scores]);
        if (s.scores[1] >= WIN_SCORE) { s.running = false; setWinner('AI'); }
        else resetBall();
      }
      if (s.bx > W) {
        s.scores[0]++;
        setScores([...s.scores]);
        if (s.scores[0] >= WIN_SCORE) { s.running = false; setWinner('You'); }
        else resetBall();
      }

      ctx.fillStyle = '#0f0f13';
      ctx.fillRect(0, 0, W, H);

      // Center line
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = '#2a2a3a';
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#6c5ce7';
      ctx.fillRect(10, s.p1, PAD_W, PAD_H);
      ctx.fillStyle = '#e64646';
      ctx.fillRect(W - PAD_W - 10, s.p2, PAD_W, PAD_H);

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(s.bx, s.by, BALL_R, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [resetBall]);

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 16 }}>You: {scores[0]} | AI: {scores[1]}</span>
        <button onClick={reset} style={{ padding: '6px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
          New Game
        </button>
      </div>
      <canvas ref={canvasRef} width={W} height={H} style={{ borderRadius: 8, border: '2px solid var(--border)', maxWidth: '100%' }} />
      <p style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: 13 }}>W/S keys to move your paddle</p>
      {winner && (
        <div style={{ marginTop: 12, padding: 12, borderRadius: 8, fontWeight: 600, background: winner === 'You' ? '#4caf5022' : '#e6464622', color: winner === 'You' ? '#4caf50' : '#e64646' }}>
          {winner === 'You' ? 'You Win!' : 'AI Wins!'} First to {WIN_SCORE}.
        </div>
      )}
    </div>
  );
}
