// import type { Metadata } from 'next';
import { Geist, Geist_Mono, Fustat } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const fustat = Fustat({
  variable: '--font-fustat',
  subsets: ['latin'],
});

export const metadata = {
  metadataBase: new URL('https://cuelabs.cuesoft.io'),
  title: 'CueLABS™ | Cuesoft Developer Labs',
  description: 'AI Innovation for Global Impact',
  applicationName: 'CueLABS™',
  keywords: [
    'AI',
    'Artificial',
    'Intelligence',
    'Cuesoft',
    'Community',
    'Open-Source',
    'Developer',
    'Labs',
    'CueLABS™',
  ],
  icons: [
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png', sizes: '180x180' },
    {
      rel: 'icon',
      type: 'image/png',
      url: '/favicon-32x32.png',
      sizes: '32x32',
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: '/android-chrome-192x192.png',
      sizes: '192x192',
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: '/favicon-16x16.png',
      sizes: '16x16',
    },
    {
      rel: 'mask-icon',
      url: '/safari-pinned-tab.svg',
      color: '#1a3866',
    },
  ],
  // manifest: "/site.webmanifest",
  openGraph: {
    type: 'website',
    url: 'https://cuelabs.cuesoft.io',
    title: 'CueLABS™ | Cuesoft Developer Labs',
    description: 'AI Innovation for Global Impact',
    siteName: 'CueLABS™',
    images: [
      {
        url: '/cuesoft.jpeg',
        width: 279,
        height: 279,
      },
    ],
  },
  twitter: {
    site: '@vercel',
    creator: '@cuesoftinc',
  },
  appleWebApp: {
    title: 'CueLABS™',
  },
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <Script src='https://www.googletagmanager.com/gtag/js?id=G-JBJ1KKEJ9N' />
      <Script src='/google-tag.js' strategy='lazyOnload' />
      <Script src='/meta-pixel.js' strategy='lazyOnload' />
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fustat.variable} antialiased w-screen mx-auto bg-darkmode-bg text-white`}
      >
        {/* <!-- Google Tag Manager (noscript) --> */}
        <noscript>
          <iframe
            src='https://www.googletagmanager.com/ns.html?id=GTM-P4MC5P8T'
            height='0'
            width='0'
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {/* <!-- End Google Tag Manager (noscript) --> */}
        {children}
      </body>
    </html>
  );
}
