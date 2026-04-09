import { games, categories } from '../lib/games';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GameGrid from './GameGrid';

export default function Home() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              marginBottom: 8,
              letterSpacing: -0.5,
            }}
          >
            Free Browser Games
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>
            15 games you can play instantly -- no download, no signup.
          </p>
        </div>
        <GameGrid games={games} categories={categories} />
      </main>
      <Footer />
    </>
  );
}
