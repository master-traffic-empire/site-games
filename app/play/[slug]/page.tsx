import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { games, getGameBySlug } from '../../../lib/games';
import { siteConfig } from '../../../site.config';
import GamePage from './GamePage';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) return {};

  return {
    title: `Play ${game.name} Online Free -- No Download`,
    description: game.metaDescription,
    openGraph: {
      title: `Play ${game.name} Online Free | ${siteConfig.name}`,
      description: game.metaDescription,
      url: `${siteConfig.baseUrl}/play/${game.slug}`,
      type: 'website',
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();

  const suggestions = games.filter((g) => g.slug !== slug).slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.name,
    description: game.description,
    url: `${siteConfig.baseUrl}/play/${game.slug}`,
    genre: game.category,
    gamePlatform: 'Web Browser',
    applicationCategory: 'Game',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GamePage game={game} suggestions={suggestions} />
    </>
  );
}
