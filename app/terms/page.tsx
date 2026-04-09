import type { Metadata } from 'next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for PlayThicket.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Terms of Service</h1>
        <div style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 15 }}>
          <p style={{ marginBottom: 16 }}>Last updated: April 2026</p>
          <h2 style={{ color: 'var(--text)', fontSize: 18, fontWeight: 700, marginBottom: 8, marginTop: 24 }}>Usage</h2>
          <p style={{ marginBottom: 16 }}>
            PlayThicket provides browser-based games for personal, non-commercial entertainment.
            All games are provided as-is without warranty.
          </p>
          <h2 style={{ color: 'var(--text)', fontSize: 18, fontWeight: 700, marginBottom: 8, marginTop: 24 }}>Intellectual Property</h2>
          <p style={{ marginBottom: 16 }}>
            Game mechanics used on this site are based on well-known public domain concepts.
            The specific implementation, design, and code are the property of PlayThicket.
          </p>
          <h2 style={{ color: 'var(--text)', fontSize: 18, fontWeight: 700, marginBottom: 8, marginTop: 24 }}>Limitation of Liability</h2>
          <p style={{ marginBottom: 16 }}>
            PlayThicket is not liable for any damages arising from use of this site. Games are
            provided for entertainment purposes only.
          </p>
          <h2 style={{ color: 'var(--text)', fontSize: 18, fontWeight: 700, marginBottom: 8, marginTop: 24 }}>Changes</h2>
          <p>We may update these terms at any time. Continued use of the site constitutes acceptance.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
