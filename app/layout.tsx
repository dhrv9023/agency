import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
};

export const metadata: Metadata = {
  title: 'Operations & Strategy Portal — AI Systems & Automation Agency',
  description: 'Internal operations console, lead pipeline CRM, system telemetry, and business management.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/css/global.css" />
        <link rel="stylesheet" href="/css/navigation.css" />
        <link rel="stylesheet" href="/css/components.css" />
        <link rel="stylesheet" href="/css/sections.css" />
        <link rel="stylesheet" href="/css/admin-portal.css" />
        <link rel="stylesheet" href="/admin.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="antialiased min-h-screen font-sans transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
