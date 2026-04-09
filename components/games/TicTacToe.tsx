'use client';

import { useState, useCallback } from 'react';

type Cell = 'X' | 'O' | null;
type Board = Cell[];

const LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

function checkWinner(board: Board): Cell {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

function minimax(board: Board, isMax: boolean): number {
  const winner = checkWinner(board);
  if (winner === 'O') return 10;
  if (winner === 'X') return -10;
  if (board.every((c) => c !== null)) return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i]) continue;
      board[i] = 'O';
      best = Math.max(best, minimax(board, false));
      board[i] = null;
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i]) continue;
      board[i] = 'X';
      best = Math.min(best, minimax(board, true));
      board[i] = null;
    }
    return best;
  }
}

function aiMove(board: Board): number {
  let bestVal = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    board[i] = 'O';
    const val = minimax(board, false);
    board[i] = null;
    if (val > bestVal) { bestVal = val; bestMove = i; }
  }
  return bestMove;
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [status, setStatus] = useState<string>('Your turn (X)');

  const reset = () => {
    setBoard(Array(9).fill(null));
    setStatus('Your turn (X)');
  };

  const handleClick = useCallback((idx: number) => {
    if (board[idx] || checkWinner(board)) return;
    const newBoard = [...board];
    newBoard[idx] = 'X';

    const winner = checkWinner(newBoard);
    if (winner) {
      setBoard(newBoard);
      setStatus('You Win!');
      return;
    }
    if (newBoard.every((c) => c !== null)) {
      setBoard(newBoard);
      setStatus('Draw!');
      return;
    }

    const ai = aiMove([...newBoard]);
    if (ai >= 0) newBoard[ai] = 'O';

    const winner2 = checkWinner(newBoard);
    if (winner2) {
      setBoard(newBoard);
      setStatus('AI Wins!');
      return;
    }
    if (newBoard.every((c) => c !== null)) {
      setBoard(newBoard);
      setStatus('Draw!');
      return;
    }

    setBoard(newBoard);
    setStatus('Your turn (X)');
  }, [board]);

  const winner = checkWinner(board);

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontWeight: 700, fontSize: 16 }}>{status}</span>
        <button onClick={reset} style={{ padding: '6px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
          New Game
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: 8, justifyContent: 'center' }}>
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            style={{
              width: 100, height: 100,
              fontSize: 36, fontWeight: 800,
              background: 'var(--bg)',
              border: '2px solid var(--border)',
              borderRadius: 12,
              color: cell === 'X' ? '#6c5ce7' : '#e64646',
              cursor: cell || winner ? 'default' : 'pointer',
            }}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}
