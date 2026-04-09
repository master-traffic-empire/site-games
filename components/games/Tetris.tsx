'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const COLS = 10;
const ROWS = 20;
const CELL = 24;

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]], // L
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1, 0], [0, 1, 1]], // Z
];
const COLORS = ['#00bcd4', '#edc22e', '#9c27b0', '#3f51b5', '#ff9800', '#4caf50', '#e64646'];

type Piece = { shape: number[][]; color: string; x: number; y: number };

function rotate(shape: number[][]): number[][] {
  const rows = shape.length, cols = shape[0].length;
  return Array.from({ length: cols }, (_, c) =>
    Array.from({ length: rows }, (_, r) => shape[rows - 1 - r][c])
  );
}

function createBoard(): number[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function collides(board: number[][], piece: Piece): boolean {
  for (let r = 0; r < piece.shape.length; r++)
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const nr = piece.y + r, nc = piece.x + c;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return true;
      if (board[nr][nc]) return true;
    }
  return false;
}

function merge(board: number[][], piece: Piece, colorIdx: number): number[][] {
  const b = board.map((r) => [...r]);
  for (let r = 0; r < piece.shape.length; r++)
    for (let c = 0; c < piece.shape[r].length; c++)
      if (piece.shape[r][c]) b[piece.y + r][piece.x + c] = colorIdx + 1;
  return b;
}

function clearRows(board: number[][]): { board: number[][]; cleared: number } {
  const kept = board.filter((row) => row.some((c) => c === 0));
  const cleared = ROWS - kept.length;
  const empty = Array.from({ length: cleared }, () => Array(COLS).fill(0));
  return { board: [...empty, ...kept], cleared };
}

function randomPiece(): { piece: Piece; colorIdx: number } {
  const idx = Math.floor(Math.random() * SHAPES.length);
  return {
    piece: { shape: SHAPES[idx], color: COLORS[idx], x: 3, y: 0 },
    colorIdx: idx,
  };
}

export default function Tetris() {
  const [board, setBoard] = useState(createBoard);
  const [current, setCurrent] = useState(() => randomPiece());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(true);
  const boardRef = useRef(board);
  boardRef.current = board;
  const currentRef = useRef(current);
  currentRef.current = current;

  const spawn = useCallback(() => {
    const next = randomPiece();
    if (collides(boardRef.current, next.piece)) {
      setGameOver(true);
      setRunning(false);
      return;
    }
    setCurrent(next);
  }, []);

  const drop = useCallback(() => {
    const { piece, colorIdx } = currentRef.current;
    const moved = { ...piece, y: piece.y + 1 };
    if (collides(boardRef.current, moved)) {
      const merged = merge(boardRef.current, piece, colorIdx);
      const { board: cleared, cleared: lines } = clearRows(merged);
      setBoard(cleared);
      boardRef.current = cleared;
      setScore((s) => s + lines * 100);
      spawn();
    } else {
      setCurrent({ piece: moved, colorIdx });
    }
  }, [spawn]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(drop, 500);
    return () => clearInterval(id);
  }, [running, drop]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (gameOver) return;
      const { piece, colorIdx } = currentRef.current;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const m = { ...piece, x: piece.x - 1 };
        if (!collides(boardRef.current, m)) setCurrent({ piece: m, colorIdx });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const m = { ...piece, x: piece.x + 1 };
        if (!collides(boardRef.current, m)) setCurrent({ piece: m, colorIdx });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        drop();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const rotated = { ...piece, shape: rotate(piece.shape) };
        if (!collides(boardRef.current, rotated)) setCurrent({ piece: rotated, colorIdx });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [gameOver, drop]);

  const reset = () => {
    setBoard(createBoard());
    setCurrent(randomPiece());
    setScore(0);
    setGameOver(false);
    setRunning(true);
  };

  const displayBoard = board.map((r) => [...r]);
  const { piece, colorIdx } = current;
  for (let r = 0; r < piece.shape.length; r++)
    for (let c = 0; c < piece.shape[r].length; c++)
      if (piece.shape[r][c] && piece.y + r >= 0)
        displayBoard[piece.y + r][piece.x + c] = colorIdx + 1;

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Score: {score}</span>
        <button onClick={reset} style={{ padding: '6px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
          New Game
        </button>
      </div>
      <div style={{ display: 'inline-block', background: '#111', borderRadius: 8, overflow: 'hidden', border: '2px solid var(--border)' }}>
        <svg width={COLS * CELL} height={ROWS * CELL}>
          {displayBoard.map((row, r) =>
            row.map((val, c) => (
              <rect
                key={`${r}-${c}`}
                x={c * CELL}
                y={r * CELL}
                width={CELL - 1}
                height={CELL - 1}
                rx={3}
                fill={val ? COLORS[val - 1] : '#1a1a2e'}
              />
            ))
          )}
        </svg>
      </div>
      {gameOver && (
        <div style={{ marginTop: 12, padding: 12, background: '#e6464622', borderRadius: 8, color: '#e64646', fontWeight: 600 }}>
          Game Over! Score: {score}
        </div>
      )}
    </div>
  );
}
