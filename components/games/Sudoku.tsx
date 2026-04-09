'use client';

import { useState, useMemo } from 'react';

function generatePuzzle(): { puzzle: number[][]; solution: number[][] } {
  const board: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));

  function isValid(b: number[][], r: number, c: number, n: number): boolean {
    for (let i = 0; i < 9; i++) if (b[r][i] === n || b[i][c] === n) return false;
    const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
    for (let i = br; i < br + 3; i++)
      for (let j = bc; j < bc + 3; j++) if (b[i][j] === n) return false;
    return true;
  }

  function solve(b: number[][]): boolean {
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++) {
        if (b[r][c] !== 0) continue;
        const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
        for (const n of nums) {
          if (isValid(b, r, c, n)) {
            b[r][c] = n;
            if (solve(b)) return true;
            b[r][c] = 0;
          }
        }
        return false;
      }
    return true;
  }

  solve(board);
  const solution = board.map((r) => [...r]);
  const puzzle = board.map((r) => [...r]);

  let removed = 0;
  const positions = Array.from({ length: 81 }, (_, i) => i).sort(() => Math.random() - 0.5);
  for (const pos of positions) {
    if (removed >= 40) break;
    const r = Math.floor(pos / 9), c = pos % 9;
    puzzle[r][c] = 0;
    removed++;
  }

  return { puzzle, solution };
}

export default function Sudoku() {
  const { puzzle: initPuzzle, solution } = useMemo(() => generatePuzzle(), []);
  const [board, setBoard] = useState<number[][]>(() => initPuzzle.map((r) => [...r]));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const fixed = useMemo(() => {
    const s = new Set<string>();
    initPuzzle.forEach((row, r) => row.forEach((v, c) => { if (v !== 0) s.add(`${r}-${c}`); }));
    return s;
  }, [initPuzzle]);

  const handleCellClick = (r: number, c: number) => {
    if (fixed.has(`${r}-${c}`)) return;
    setSelected([r, c]);
  };

  const handleNumber = (n: number) => {
    if (!selected) return;
    const [r, c] = selected;
    if (fixed.has(`${r}-${c}`)) return;
    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = n;
    setBoard(newBoard);

    const newErrors = new Set(errors);
    const key = `${r}-${c}`;
    if (n !== 0 && n !== solution[r][c]) newErrors.add(key);
    else newErrors.delete(key);
    setErrors(newErrors);
  };

  const won = board.every((row, r) => row.every((v, c) => v === solution[r][c]));

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(9, 36px)', gap: 1, background: 'var(--border)', borderRadius: 8, overflow: 'hidden', border: '2px solid var(--border)' }}>
        {board.map((row, r) =>
          row.map((val, c) => {
            const isSelected = selected?.[0] === r && selected?.[1] === c;
            const isFixed = fixed.has(`${r}-${c}`);
            const isError = errors.has(`${r}-${c}`);
            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                style={{
                  width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: 'none',
                  borderRight: (c + 1) % 3 === 0 && c < 8 ? '2px solid var(--text-muted)' : undefined,
                  borderBottom: (r + 1) % 3 === 0 && r < 8 ? '2px solid var(--text-muted)' : undefined,
                  background: isSelected ? 'var(--accent)' + '44' : 'var(--bg-card)',
                  color: isError ? '#e64646' : isFixed ? 'var(--text)' : '#6c5ce7',
                  fontSize: 16, fontWeight: isFixed ? 700 : 500,
                  cursor: isFixed ? 'default' : 'pointer',
                }}
              >
                {val !== 0 ? val : ''}
              </button>
            );
          })
        )}
      </div>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
        {[1,2,3,4,5,6,7,8,9].map((n) => (
          <button
            key={n}
            onClick={() => handleNumber(n)}
            style={{
              width: 40, height: 40,
              borderRadius: 8, border: '1px solid var(--border)',
              background: 'var(--bg)', color: 'var(--text)',
              fontSize: 16, fontWeight: 600,
            }}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleNumber(0)}
          style={{
            width: 40, height: 40,
            borderRadius: 8, border: '1px solid var(--border)',
            background: 'var(--bg)', color: 'var(--text-muted)',
            fontSize: 12, fontWeight: 600,
          }}
        >
          CLR
        </button>
      </div>
      {won && (
        <div style={{ marginTop: 16, padding: 12, background: '#4caf5022', borderRadius: 8, color: '#4caf50', fontWeight: 600 }}>
          Puzzle Complete!
        </div>
      )}
    </div>
  );
}
