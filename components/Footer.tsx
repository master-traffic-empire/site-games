import Link from 'next/link';

const style: Record<string, React.CSSProperties> = {
  footer: {
    padding: '32px 24px',
    borderTop: '1px solid var(--border)',
    textAlign: 'center' as const,
    fontSize: 13,
    color: 'var(--text-muted)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 12,
  },
  links: {
    display: 'flex',
    gap: 20,
  },
};

export default function Footer() {
  return (
    <footer style={style.footer}>
      <div style={style.links}>
        <Link href="/about">About</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </div>
      <div>PlayThicket -- Free browser games, no download required.</div>
    </footer>
  );
}
