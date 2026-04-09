import Image from 'next/image';
import Link from 'next/link';
import { type GameInfo } from '../lib/games';
import { Puzzle, Zap, Spade, Type, Brain } from 'lucide-react';

const categoryIcons: Record<string, typeof Puzzle> = {
  Puzzle,
  Arcade: Zap,
  Card: Spade,
  Word: Type,
  Brain,
};

export default function GameCard({ game }: { game: GameInfo }) {
  const Icon = categoryIcons[game.category] || Puzzle;

  return (
    <Link
      href={`/play/${game.slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        transition: 'transform 0.15s, border-color 0.15s',
        textDecoration: 'none',
      }}
      className="game-card"
    >
      <div
        style={{
          height: 160,
          position: 'relative',
          overflow: 'hidden',
          borderBottom: `2px solid ${game.color}44`,
        }}
      >
        <Image
          src={`/covers/${game.slug}.png`}
          alt={game.name}
          fill
          sizes="(max-width: 600px) 100vw, 280px"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 15 }}>{game.name}</span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              color: game.color,
              background: `${game.color}18`,
              padding: '2px 8px',
              borderRadius: 20,
              fontWeight: 600,
            }}
          >
            <Icon size={12} />
            {game.category}
          </span>
        </div>
        <p
          style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            lineHeight: 1.5,
          }}
        >
          {game.description}
        </p>
      </div>
    </Link>
  );
}
