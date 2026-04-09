'use client';

import { useState, useMemo, useCallback } from 'react';

const SUITS = ['S', 'H', 'D', 'C'] as const;
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;

type Card = { suit: typeof SUITS[number]; rank: typeof RANKS[number]; faceUp: boolean };
type Pile = Card[];

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) for (const rank of RANKS) deck.push({ suit, rank, faceUp: false });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function rankVal(rank: string): number { return RANKS.indexOf(rank as typeof RANKS[number]); }
function isRed(suit: string) { return suit === 'H' || suit === 'D'; }

function suitColor(suit: string): string {
  return isRed(suit) ? '#e64646' : '#e8e8f0';
}

function deal() {
  const deck = createDeck();
  const tableau: Pile[] = Array.from({ length: 7 }, () => []);
  let idx = 0;
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      tableau[col].push({ ...deck[idx], faceUp: row === col });
      idx++;
    }
  }
  const stock = deck.slice(idx).map((c) => ({ ...c, faceUp: false }));
  const foundations: Pile[] = [[], [], [], []];
  return { tableau, stock, waste: [] as Pile, foundations };
}

type GameState = ReturnType<typeof deal>;
type Selection = { from: 'tableau' | 'waste'; col?: number; idx?: number } | null;

const CW = 52, CH = 72;

function CardView({ card, onClick, style: extraStyle }: { card: Card | null; onClick?: () => void; style?: React.CSSProperties }) {
  if (!card) return (
    <div onClick={onClick} style={{ width: CW, height: CH, borderRadius: 6, border: '2px dashed #333', ...extraStyle, cursor: onClick ? 'pointer' : 'default' }} />
  );
  if (!card.faceUp) return (
    <div onClick={onClick} style={{ width: CW, height: CH, borderRadius: 6, background: '#3f51b5', border: '1px solid #555', ...extraStyle, cursor: onClick ? 'pointer' : 'default' }} />
  );
  return (
    <div onClick={onClick} style={{ width: CW, height: CH, borderRadius: 6, background: '#1e1e2e', border: '1px solid #444', display: 'flex', flexDirection: 'column', padding: '3px 5px', fontSize: 12, fontWeight: 700, color: suitColor(card.suit), cursor: onClick ? 'pointer' : 'default', ...extraStyle }}>
      <span>{card.rank}{card.suit}</span>
    </div>
  );
}

export default function Solitaire() {
  const [game, setGame] = useState<GameState>(deal);
  const [selected, setSelected] = useState<Selection>(null);

  const drawCard = () => {
    const g = { ...game, stock: [...game.stock], waste: [...game.waste] };
    if (g.stock.length === 0) {
      g.stock = g.waste.reverse().map((c) => ({ ...c, faceUp: false }));
      g.waste = [];
    } else {
      const card = g.stock.pop()!;
      card.faceUp = true;
      g.waste.push(card);
    }
    setGame(g);
    setSelected(null);
  };

  const canPlaceOnTableau = (card: Card, pile: Pile): boolean => {
    if (pile.length === 0) return card.rank === 'K';
    const top = pile[pile.length - 1];
    return top.faceUp && isRed(card.suit) !== isRed(top.suit) && rankVal(card.rank) === rankVal(top.rank) - 1;
  };

  const canPlaceOnFoundation = (card: Card, pile: Pile): boolean => {
    if (pile.length === 0) return card.rank === 'A';
    const top = pile[pile.length - 1];
    return card.suit === top.suit && rankVal(card.rank) === rankVal(top.rank) + 1;
  };

  const handleTableauClick = useCallback((col: number, cardIdx: number) => {
    const pile = game.tableau[col];
    const card = pile[cardIdx];
    if (!card || !card.faceUp) return;

    if (selected) {
      if (selected.from === 'waste') {
        const wasteCard = game.waste[game.waste.length - 1];
        if (wasteCard && canPlaceOnTableau(wasteCard, pile)) {
          const g = { ...game, tableau: game.tableau.map((p) => [...p]), waste: [...game.waste] };
          g.tableau[col].push(g.waste.pop()!);
          setGame(g);
        }
      } else if (selected.from === 'tableau' && selected.col !== undefined && selected.idx !== undefined) {
        const srcCol = selected.col;
        const srcIdx = selected.idx;
        const moving = game.tableau[srcCol].slice(srcIdx);
        if (moving.length > 0 && canPlaceOnTableau(moving[0], pile)) {
          const g = { ...game, tableau: game.tableau.map((p) => [...p]) };
          g.tableau[srcCol] = g.tableau[srcCol].slice(0, srcIdx);
          g.tableau[col] = [...g.tableau[col], ...moving];
          if (g.tableau[srcCol].length > 0) {
            g.tableau[srcCol][g.tableau[srcCol].length - 1].faceUp = true;
          }
          setGame(g);
        }
      }
      setSelected(null);
    } else {
      setSelected({ from: 'tableau', col, idx: cardIdx });
    }
  }, [game, selected]);

  const handleFoundationClick = (fIdx: number) => {
    if (!selected) return;
    let card: Card | undefined;
    const g = { ...game, tableau: game.tableau.map((p) => [...p]), waste: [...game.waste], foundations: game.foundations.map((p) => [...p]) };

    if (selected.from === 'waste') {
      card = g.waste[g.waste.length - 1];
      if (card && canPlaceOnFoundation(card, g.foundations[fIdx])) {
        g.foundations[fIdx].push(g.waste.pop()!);
        setGame(g);
      }
    } else if (selected.from === 'tableau' && selected.col !== undefined) {
      const pile = g.tableau[selected.col];
      card = pile[pile.length - 1];
      if (card && canPlaceOnFoundation(card, g.foundations[fIdx])) {
        g.foundations[fIdx].push(pile.pop()!);
        if (pile.length > 0) pile[pile.length - 1].faceUp = true;
        setGame(g);
      }
    }
    setSelected(null);
  };

  const handleWasteClick = () => {
    if (game.waste.length === 0) return;
    setSelected({ from: 'waste' });
  };

  const won = game.foundations.every((f) => f.length === 13);

  return (
    <div style={{ padding: 16, overflowX: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
        <button onClick={() => { setGame(deal()); setSelected(null); }} style={{ padding: '6px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
          New Game
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <div onClick={drawCard} style={{ cursor: 'pointer' }}>
          <CardView card={game.stock.length > 0 ? { suit: 'S', rank: 'A', faceUp: false } : null} onClick={drawCard} />
        </div>
        <div onClick={handleWasteClick} style={{ cursor: 'pointer' }}>
          <CardView
            card={game.waste.length > 0 ? game.waste[game.waste.length - 1] : null}
            style={selected?.from === 'waste' ? { boxShadow: '0 0 0 2px var(--accent)' } : {}}
          />
        </div>
        <div style={{ flex: 1 }} />
        {game.foundations.map((f, i) => (
          <div key={i} onClick={() => handleFoundationClick(i)} style={{ cursor: 'pointer' }}>
            <CardView card={f.length > 0 ? f[f.length - 1] : null} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {game.tableau.map((pile, col) => (
          <div key={col} style={{ position: 'relative', width: CW, minHeight: CH + 20 * 12 }}>
            {pile.length === 0 && <CardView card={null} />}
            {pile.map((card, idx) => (
              <div
                key={idx}
                onClick={() => handleTableauClick(col, idx)}
                style={{
                  position: 'absolute',
                  top: idx * (card.faceUp ? 24 : 10),
                  zIndex: idx,
                }}
              >
                <CardView
                  card={card}
                  style={
                    selected?.from === 'tableau' && selected.col === col && selected.idx !== undefined && idx >= selected.idx
                      ? { boxShadow: '0 0 0 2px var(--accent)' }
                      : {}
                  }
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      {won && (
        <div style={{ marginTop: 16, padding: 12, background: '#4caf5022', borderRadius: 8, color: '#4caf50', fontWeight: 600, textAlign: 'center' }}>
          You Win! All cards sorted.
        </div>
      )}
    </div>
  );
}
