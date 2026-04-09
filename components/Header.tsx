import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';

const style: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-card)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 20,
    fontWeight: 700,
    color: 'var(--accent)',
  },
  nav: {
    display: 'flex',
    gap: 20,
    fontSize: 14,
    color: 'var(--text-muted)',
  },
};

export default function Header() {
  return (
    <header style={style.header}>
      <Link href="/" style={style.logo}>
        <Gamepad2 size={24} />
        PlayThicket
      </Link>
      <nav style={style.nav}>
        <Link href="/">Games</Link>
        <Link href="/about">About</Link>
      </nav>
    </header>
  );
}
