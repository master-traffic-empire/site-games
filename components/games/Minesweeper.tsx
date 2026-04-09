'use client';

import { useState, useCallback } from 'react';

const SIZE = 10;
const MINES = 15;

type Cell = { mine: boolean; revealed: boolean; flagged: boolean; neighbors: number };
type Board = Cell[][];

function createBoard(): Board {
  const board: Board = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => ({
      mine: false, revealed: false, flagged: false, neighbors: 0,
    }))
  );
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * SIZE);
    const c = Math.floor(Math.random() * SIZE);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placed++;
    }
  }
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      let count = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc].mine) count++;
        }
      board[r][c].neighbors = count;
    }
  return board;
}

function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

function reveal(board: Board, r: number, c: number): Board {
  const b = cloneBoard(board);
  const stack: [number, number][] = [[r, c]];
  while (stack.length) {
    const [cr, cc] = stack.pop()!;
    if (cr < 0 || cr >= SIZE || cc < 0 || cc >= SIZE) continue;
    if (b[cr][cc].revealed || b[cr][cc].flagged) continue;
    b[cr][cc].revealed = true;
    if (b[cr][cc].neighbors === 0 && !b[cr][cc].mine) {
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) stack.push([cr + dr, cc + dc]);
    }
  }
  return b;
}

const numColors: Record<number, string> = {
  1: '#4fc3f7', 2: '#66bb6a', 3: '#ef5350', 4: '#ab47bc',
  5: '#ff7043', 6: '#26c6da', 7: '#555', 8: '#888',
};

export default function Minesweeper() {
  const [board, setBoard] = useState<Board>(createBoard);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const checkWin = useCallback((b: Board) => {
    const allNonMinesRevealed = b.every((row) =>
      row.every((cell) => cell.mine || cell.revealed)
    );
    if (allNonMinesRevealed) setStatus('won');
  }, []);

  const handleClick = (r: number, c: number) => {
    if (status !== 'playing') return;
    const cell = board[r][c];
    if (cell.revealed || cell.flagged) return;
    if (cell.mine) {
      const b = cloneBoard(board);
      b.forEach((row) => row.forEach((c) => { if (c.mine) c.revealed = true; }));
      setBoard(b);
      setStatus('lost');
      return;
    }
    const b = reveal(board, r, c);
    setBoard(b);
    checkWin(b);
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (status !== 'playing') return;
    const cell = board[r][c];
    if (cell.revealed) return;
    const b = cloneBoard(board);
    b[r][c].flagged = !b[r][c].flagged;
    setBoard(b);
  };

  const reset = () => {
    setBoard(createBoard());
    setStatus('playing');
  };

  const flagCount = board.flat().filter((c) => c.flagged).length;

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 16 }}>
          Mines: {MINES - flagCount}
        </span>
        <button onClick={reset} style={{ padding: '6px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
          New Game
        </button>
      </div>
      <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${SIZE}, 32px)`, gap: 2, background: '#111', padding: 4, borderRadius: 8 }}>
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => handleClick(r, c)}
              onContextMenu={(e) => handleRightClick(e, r, c)}
              style={{
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', borderRadius: 4,
                fontSize: 14, fontWeight: 700,
                background: cell.revealed ? '#1a1a2e' : '#2a2a3a',
                color: cell.revealed && cell.neighbors ? numColors[cell.neighbors] || '#888' : '#fff',
                cursor: 'pointer',
              }}
            >
              {cell.revealed && cell.mine ? '*' : ''}
              {cell.revealed && !cell.mine && cell.neighbors > 0 ? cell.neighbors : ''}
              {!cell.revealed && cell.flagged ? 'F' : ''}
            </button>
          ))
        )}
      </div>
      {status !== 'playing' && (
        <div style={{
          marginTop: 12, padding: 12, borderRadius: 8, fontWeight: 600,
          background: status === 'won' ? '#4caf5022' : '#e6464622',
          color: status === 'won' ? '#4caf50' : '#e64646',
        }}>
          {status === 'won' ? 'You Win!' : 'Game Over!'}
        </div>
      )}
    </div>
  );
}
