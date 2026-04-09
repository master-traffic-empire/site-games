'use client';

import { useState, useEffect, useCallback } from 'react';

type Board = number[][];

function createEmpty(): Board {
  return Array.from({ length: 4 }, () => Array(4).fill(0));
}

function addRandom(board: Board): Board {
  const b = board.map((r) => [...r]);
  const empty: [number, number][] = [];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) if (b[r][c] === 0) empty.push([r, c]);
  if (empty.length === 0) return b;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  b[r][c] = Math.random() < 0.9 ? 2 : 4;
  return b;
}

function slideRow(row: number[]): { row: number[]; score: number } {
  const filtered = row.filter((v) => v !== 0);
  let score = 0;
  const merged: number[] = [];
  let i = 0;
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      merged.push(filtered[i] * 2);
      score += filtered[i] * 2;
      i += 2;
    } else {
      merged.push(filtered[i]);
      i++;
    }
  }
  while (merged.length < 4) merged.push(0);
  return { row: merged, score };
}

function move(board: Board, dir: string): { board: Board; score: number } {
  let b = board.map((r) => [...r]);
  let total = 0;

  if (dir === 'left') {
    for (let r = 0; r < 4; r++) {
      const { row, score } = slideRow(b[r]);
      b[r] = row;
      total += score;
    }
  } else if (dir === 'right') {
    for (let r = 0; r < 4; r++) {
      const { row, score } = slideRow([...b[r]].reverse());
      b[r] = row.reverse();
      total += score;
    }
  } else if (dir === 'up') {
    for (let c = 0; c < 4; c++) {
      const col = [b[0][c], b[1][c], b[2][c], b[3][c]];
      const { row, score } = slideRow(col);
      for (let r = 0; r < 4; r++) b[r][c] = row[r];
      total += score;
    }
  } else if (dir === 'down') {
    for (let c = 0; c < 4; c++) {
      const col = [b[3][c], b[2][c], b[1][c], b[0][c]];
      const { row, score } = slideRow(col);
      const rev = row.reverse();
      for (let r = 0; r < 4; r++) b[r][c] = rev[r];
      total += score;
    }
  }
  return { board: b, score: total };
}

function boardsEqual(a: Board, b: Board) {
  return a.every((row, r) => row.every((v, c) => v === b[r][c]));
}

function canMove(board: Board): boolean {
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) return true;
      if (c < 3 && board[r][c] === board[r][c + 1]) return true;
      if (r < 3 && board[r][c] === board[r + 1][c]) return true;
    }
  return false;
}

const tileColors: Record<number, string> = {
  0: '#2a2a3a',
  2: '#3d3d52',
  4: '#4a4a62',
  8: '#e67c3c',
  16: '#e65c2c',
  32: '#e64c3c',
  64: '#e63c1c',
  128: '#edc22e',
  256: '#edb82e',
  512: '#edae2e',
  1024: '#eda42e',
  2048: '#ed9a2e',
};

export default function Game2048() {
  const [board, setBoard] = useState<Board>(() =>
    addRandom(addRandom(createEmpty()))
  );
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleMove = useCallback(
    (dir: string) => {
      if (gameOver) return;
      const { board: newBoard, score: gained } = move(board, dir);
      if (boardsEqual(board, newBoard)) return;
      const withNew = addRandom(newBoard);
      setBoard(withNew);
      setScore((s) => s + gained);
      if (!canMove(withNew)) setGameOver(true);
    },
    [board, gameOver]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, string> = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down',
      };
      if (map[e.key]) {
        e.preventDefault();
        handleMove(map[e.key]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleMove]);

  useEffect(() => {
    let startX = 0, startY = 0;
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
      if (Math.abs(dx) > Math.abs(dy)) handleMove(dx > 0 ? 'right' : 'left');
      else handleMove(dy > 0 ? 'down' : 'up');
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchend', onEnd);
    };
  }, [handleMove]);

  const reset = () => {
    setBoard(addRandom(addRandom(createEmpty())));
    setScore(0);
    setGameOver(false);
  };

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 18, fontWeight: 700 }}>Score: {score}</span>
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
          New Game
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
          background: '#1e1e2e',
          padding: 8,
          borderRadius: 12,
        }}
      >
        {board.flat().map((val, i) => (
          <div
            key={i}
            style={{
              aspectRatio: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: val >= 1024 ? 18 : val >= 128 ? 22 : 26,
              background: tileColors[val] || '#ed9a2e',
              color: val <= 4 ? 'var(--text-muted)' : '#fff',
              transition: 'all 0.1s',
            }}
          >
            {val !== 0 ? val : ''}
          </div>
        ))}
      </div>
      {gameOver && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: '#e6464622',
            borderRadius: 8,
            color: '#e64646',
            fontWeight: 600,
          }}
        >
          Game Over! Final score: {score}
        </div>
      )}
    </div>
  );
}
