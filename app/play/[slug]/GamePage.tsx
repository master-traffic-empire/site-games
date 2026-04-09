'use client';

import Link from 'next/link';
import { ArrowLeft, Info } from 'lucide-react';
import type { GameInfo } from '../../../lib/games';
import GameCard from '../../../components/GameCard';
import dynamic from 'next/dynamic';

const gameComponents: Record<string, React.ComponentType> = {
  '2048': dynamic(() => import('../../../components/games/Game2048'), { ssr: false }),
  snake: dynamic(() => import('../../../components/games/Snake'), { ssr: false }),
  tetris: dynamic(() => import('../../../components/games/Tetris'), { ssr: false }),
  minesweeper: dynamic(() => import('../../../components/games/Minesweeper'), { ssr: false }),
  'flappy-bird': dynamic(() => import('../../../components/games/FlappyBird'), { ssr: false }),
  breakout: dynamic(() => import('../../../components/games/Breakout'), { ssr: false }),
  'memory-match': dynamic(() => import('../../../components/games/MemoryMatch'), { ssr: false }),
  'tic-tac-toe': dynamic(() => import('../../../components/games/TicTacToe'), { ssr: false }),
  sudoku: dynamic(() => import('../../../components/games/Sudoku'), { ssr: false }),
  wordle: dynamic(() => import('../../../components/games/Wordle'), { ssr: false }),
  solitaire: dynamic(() => import('../../../components/games/Solitaire'), { ssr: false }),
  pong: dynamic(() => import('../../../components/games/Pong'), { ssr: false }),
  'space-invaders': dynamic(() => import('../../../components/games/SpaceInvaders'), { ssr: false }),
  'typing-speed': dynamic(() => import('../../../components/games/TypingSpeed'), { ssr: false }),
  'math-quiz': dynamic(() => import('../../../components/games/MathQuiz'), { ssr: false }),
};

export default function GamePage({
  game,
  suggestions,
}: {
  game: GameInfo;
  suggestions: GameInfo[];
}) {
  const GameComponent = gameComponents[game.slug];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-card)',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--text-muted)',
            fontSize: 14,
          }}
        >
          <ArrowLeft size={16} />
          All Games
        </Link>
        <span style={{ color: 'var(--border)' }}>|</span>
        <h1 style={{ fontSize: 18, fontWeight: 700 }}>{game.name}</h1>
        <span
          style={{
            fontSize: 11,
            color: game.color,
            background: `${game.color}18`,
            padding: '2px 10px',
            borderRadius: 20,
            fontWeight: 600,
          }}
        >
          {game.category}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 600,
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            overflow: 'hidden',
          }}
        >
          {GameComponent ? <GameComponent /> : <p>Game not found</p>}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 24px',
          color: 'var(--text-muted)',
          fontSize: 13,
        }}
      >
        <Info size={14} />
        {game.controls}
      </div>

      <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          More Games
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 16,
          }}
        >
          {suggestions.map((g) => (
            <GameCard key={g.slug} game={g} />
          ))}
        </div>
      </div>
    </div>
  );
}
