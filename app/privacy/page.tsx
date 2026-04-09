import type { Metadata } from 'next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for PlayThicket.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Privacy Policy</h1>
        <div style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 15 }}>
          <p style={{ marginBottom: 16 }}>Last updated: April 2026</p>
          <h2 style={{ color: 'var(--text)', fontSize: 18, fontWeight: 700, marginBottom: 8, marginTop: 24 }}>Data Collection</h2>
          <p style={{ marginBottom: 16 }}>
            PlayThicket uses Google Analytics 4 to collect anonymous usage data such as page
            views and general geographic region. We do not collect personal information, email
            addresses, or account data.
          </p>
          <h2 style={{ color: 'var(--text)', fontSize: 18, fontWeight: 700, marginBottom: 8, marginTop: 24 }}>Cookies</h2>
          <p style={{ marginBottom: 16 }}>
            Google Analytics may set cookies to distinguish users and sessions. No other cookies
            are used by PlayThicket.
          </p>
          <h2 style={{ color: 'var(--text)', fontSize: 18, fontWeight: 700, marginBottom: 8, marginTop: 24 }}>Local Storage</h2>
          <p style={{ marginBottom: 16 }}>
            Games may use browser local storage to save scores or preferences. This data never
            leaves your device.
          </p>
          <h2 style={{ color: 'var(--text)', fontSize: 18, fontWeight: 700, marginBottom: 8, marginTop: 24 }}>Contact</h2>
          <p>If you have questions about this policy, contact us at privacy@thicket.sh.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
