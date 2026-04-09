'use client';

import { useState, useEffect, useRef } from 'react';

const SYMBOLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COLORS = ['#e64646', '#4caf50', '#00bcd4', '#ff9800', '#9c27b0', '#3f51b5', '#edc22e', '#e91e63'];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Card = { id: number; symbol: string; color: string; matched: boolean };

function createDeck(): Card[] {
  const pairs = SYMBOLS.map((s, i) => [
    { id: i * 2, symbol: s, color: COLORS[i], matched: false },
    { id: i * 2 + 1, symbol: s, color: COLORS[i], matched: false },
  ]).flat();
  return shuffle(pairs);
}

export default function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>(createDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const lockRef = useRef(false);

  const handleClick = (idx: number) => {
    if (lockRef.current) return;
    if (flipped.includes(idx) || cards[idx].matched) return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      lockRef.current = true;
      const [a, b] = newFlipped;
      if (cards[a].symbol === cards[b].symbol) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c))
          );
          setFlipped([]);
          lockRef.current = false;
        }, 400);
      } else {
        setTimeout(() => {
          setFlipped([]);
          lockRef.current = false;
        }, 800);
      }
    }
  };

  const won = cards.every((c) => c.matched);

  const reset = () => {
    setCards(createDeck());
    setFlipped([]);
    setMoves(0);
    lockRef.current = false;
  };

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontWeight: 700, fontSize: 16 }}>Moves: {moves}</span>
        <button onClick={reset} style={{ padding: '6px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
          New Game
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, maxWidth: 360, margin: '0 auto' }}>
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || card.matched;
          return (
            <button
              key={card.id}
              onClick={() => handleClick(idx)}
              style={{
                aspectRatio: '1',
                borderRadius: 10,
                border: '2px solid var(--border)',
                background: isFlipped ? card.color + '22' : 'var(--bg)',
                color: isFlipped ? card.color : 'transparent',
                fontSize: 28,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                cursor: card.matched ? 'default' : 'pointer',
                opacity: card.matched ? 0.5 : 1,
              }}
            >
              {isFlipped ? card.symbol : '?'}
            </button>
          );
        })}
      </div>
      {won && (
        <div style={{ marginTop: 16, padding: 12, background: '#4caf5022', borderRadius: 8, color: '#4caf50', fontWeight: 600 }}>
          You Win! Completed in {moves} moves
        </div>
      )}
    </div>
  );
}
