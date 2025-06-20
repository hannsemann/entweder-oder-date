// app/layout.tsx - FINALE VERSION

import './globals.css';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: "entweder-oder-date.de | Schluss mit Smalltalk!",
  description: "Das ehrlichste Kennenlernspiel für euer Date.",
  icons: [{ rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <header className="site-header">
          <Link href="/">
            <Image
              className="logo-image"
              src="/logo.svg"
              alt="entweder-oder-date Logo"
              width={300}
              height={150}
              priority
            />
          </Link>
        </header>
        
        {/* Dieser Container ist jetzt der flexible Hauptbereich */}
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}