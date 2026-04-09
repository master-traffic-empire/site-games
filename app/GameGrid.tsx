'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import type { GameInfo, Category } from '../lib/games';
import GameCard from '../components/GameCard';

export default function GameGrid({
  games,
  categories,
}: {
  games: GameInfo[];
  categories: Category[];
}) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');

  const filtered = games.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' || g.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
          marginBottom: 28,
        }}
      >
        <div
          style={{
            position: 'relative',
            flex: '1 1 220px',
            maxWidth: 320,
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text)',
              fontSize: 14,
              outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['All', ...categories] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: 'none',
                fontSize: 13,
                fontWeight: 600,
                background:
                  activeCategory === cat
                    ? 'var(--accent)'
                    : 'var(--bg-card)',
                color:
                  activeCategory === cat ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.15s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .game-card:hover {
          transform: translateY(-3px);
          border-color: var(--accent) !important;
        }
      `}</style>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20,
        }}
      >
        {filtered.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            padding: 48,
          }}
        >
          No games found matching your search.
        </p>
      )}
    </>
  );
}
