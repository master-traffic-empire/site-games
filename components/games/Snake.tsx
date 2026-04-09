'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const GRID = 20;
const CELL = 20;
const TICK = 120;

type Pos = { x: number; y: number };

function randomFood(snake: Pos[]): Pos {
  let pos: Pos;
  do {
    pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

export default function Snake() {
  const [snake, setSnake] = useState<Pos[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Pos>({ x: 5, y: 5 });
  const [dir, setDir] = useState<Pos>({ x: 1, y: 0 });
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const dirRef = useRef(dir);
  dirRef.current = dir;
  const snakeRef = useRef(snake);
  snakeRef.current = snake;

  const reset = () => {
    const s = [{ x: 10, y: 10 }];
    setSnake(s);
    setFood(randomFood(s));
    setDir({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
    setRunning(true);
  };

  const tick = useCallback(() => {
    const s = snakeRef.current;
    const d = dirRef.current;
    const head = { x: s[0].x + d.x, y: s[0].y + d.y };
    if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
      setGameOver(true);
      setRunning(false);
      return;
    }
    if (s.some((p) => p.x === head.x && p.y === head.y)) {
      setGameOver(true);
      setRunning(false);
      return;
    }
    const newSnake = [head, ...s];
    setFood((f) => {
      if (head.x === f.x && head.y === f.y) {
        setScore((sc) => sc + 10);
        const nf = randomFood(newSnake);
        setFood(nf);
      } else {
        newSnake.pop();
      }
      return f;
    });
    setSnake(newSnake);
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(tick, TICK);
    return () => clearInterval(id);
  }, [running, tick]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Pos> = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      };
      const nd = map[e.key];
      if (!nd) return;
      e.preventDefault();
      if (!running && !gameOver) {
        setRunning(true);
      }
      const d = dirRef.current;
      if (nd.x + d.x !== 0 || nd.y + d.y !== 0) {
        setDir(nd);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [running, gameOver]);

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Score: {score}</span>
        <button
          onClick={reset}
          style={{
            padding: '6px 16px',
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {gameOver ? 'Restart' : 'New Game'}
        </button>
      </div>
      <div
        style={{
          display: 'inline-block',
          background: '#1a1a2e',
          borderRadius: 8,
          overflow: 'hidden',
          border: '2px solid var(--border)',
        }}
      >
        <svg width={GRID * CELL} height={GRID * CELL}>
          {snake.map((p, i) => (
            <rect
              key={i}
              x={p.x * CELL}
              y={p.y * CELL}
              width={CELL - 1}
              height={CELL - 1}
              rx={3}
              fill={i === 0 ? '#4caf50' : '#66bb6a'}
            />
          ))}
          <circle
            cx={food.x * CELL + CELL / 2}
            cy={food.y * CELL + CELL / 2}
            r={CELL / 2 - 2}
            fill="#e64646"
          />
        </svg>
      </div>
      {!running && !gameOver && (
        <p style={{ marginTop: 12, color: 'var(--text-muted)', fontSize: 14 }}>
          Press an arrow key to start
        </p>
      )}
      {gameOver && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            background: '#e6464622',
            borderRadius: 8,
            color: '#e64646',
            fontWeight: 600,
          }}
        >
          Game Over! Score: {score}
        </div>
      )}
    </div>
  );
}
