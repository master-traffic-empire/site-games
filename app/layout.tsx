import type { Metadata } from 'next';
import { siteConfig } from '../site.config';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} -- Free Browser Games, No Download`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.baseUrl),
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: 'en_US',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.ga4Id}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              if (new URLSearchParams(window.location.search).has('_internal')) {
                window['ga-disable-${siteConfig.ga4Id}'] = true;
              }
              gtag('js', new Date());
              gtag('config', '${siteConfig.ga4Id}');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
