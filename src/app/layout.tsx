import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MonetiseUp | RTB Bidding Server & Exchange',
  description: 'Next.js Demand Aggregator & Auction Engine for Prebid.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
