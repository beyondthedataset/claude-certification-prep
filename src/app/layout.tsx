import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Claude Certification Guide — Free Mock Exams & Study Guides',
  description: 'Exam-realistic mock exams, 574 verified practice questions across 2 question banks, 30 official subdomains, scoring, and study guides for Anthropic Claude Certified Architect (Foundations) CCAR-F.',
  keywords: [
    'Claude certification',
    'Claude Certified Architect',
    'Claude mock exam',
    'CCA-F',
    'CCAR-F',
    'Anthropic certification',
    'Model Context Protocol',
    'MCP servers',
    'Prompt engineering Claude',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col selection:bg-primary/20 selection:text-primary">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
