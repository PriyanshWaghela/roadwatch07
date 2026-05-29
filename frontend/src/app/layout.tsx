import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'RoadWatch — AI-Powered Infrastructure Intelligence',
  description:
    'RoadWatch is an AI-powered civic-tech platform that uses neural detection, real-time analytics, and transparency dashboards to transform urban road infrastructure management.',
  keywords: [
    'road monitoring',
    'AI infrastructure',
    'smart city',
    'civic tech',
    'pothole detection',
    'road analytics',
    'public spending tracker',
  ],
  authors: [{ name: 'RoadWatch' }],
  openGraph: {
    title: 'RoadWatch — AI-Powered Infrastructure Intelligence',
    description:
      'Transform urban infrastructure with AI-powered road damage detection, real-time analytics, and public spending transparency.',
    type: 'website',
    locale: 'en_US',
    siteName: 'RoadWatch',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RoadWatch — AI-Powered Infrastructure Intelligence',
    description:
      'Transform urban infrastructure with AI-powered road damage detection.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#121315',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} bg-background text-on-surface antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2022',
                color: '#e3e2e5',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
                backdropFilter: 'blur(12px)',
              },
              success: {
                iconTheme: {
                  primary: '#40e56c',
                  secondary: '#003912',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ffb4ab',
                  secondary: '#93000a',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
