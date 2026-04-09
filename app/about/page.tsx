import type { Metadata } from 'next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata: Metadata = {
  title: 'About',
  description: 'About PlayThicket — free browser games you can play instantly.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>About PlayThicket</h1>
        <div style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 15 }}>
          <p style={{ marginBottom: 16 }}>
            PlayThicket is a collection of 15 classic browser games you can play instantly -- no
            downloads, no signups, no ads. Just open a game and start playing.
          </p>
          <p style={{ marginBottom: 16 }}>
            Every game runs entirely in your browser. Nothing is sent to a server. Your scores
            and progress stay on your device.
          </p>
          <p style={{ marginBottom: 16 }}>
            The games cover a range of categories: puzzles like 2048 and Sudoku, arcade classics
            like Snake and Breakout, card games like Solitaire, word games like Wordle, and brain
            training exercises like Typing Speed and Math Quiz.
          </p>
          <p>
            Built with Next.js and React. All game logic is implemented in client-side TypeScript
            using HTML5 Canvas and DOM rendering.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
