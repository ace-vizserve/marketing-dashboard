import './globals.css';

export const metadata = {
  title: 'HFSE International School — Q1 2026 Marketing Dashboard',
  description: 'Marketing Performance Dashboard for HFSE International School, Q1 2026',
  icons: {
    icon: '/hfse-logo-favicon.webp',
    apple: '/hfse-logo-favicon.webp',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
