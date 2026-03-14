'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import './globals.scss';
import SmoothScroll from '@/components/common/SmoothScroll';
import Preloader from '@/components/layout/Preloader';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function RootLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.style.cursor = 'default';
    window.scrollTo(0, 0);

    // Inject DM Sans font (closest free alternative to Dennis Sans)
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap';
    document.head.appendChild(link);
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {isLoading ? (
          <Preloader finishLoading={() => setIsLoading(false)} />
        ) : (
          <SmoothScroll>
            {/* Navbar and Footer are OUTSIDE main — they never unmount */}
            <Navbar />
            <main>
              {children}
            </main>
            <Footer />
          </SmoothScroll>
        )}
      </body>
    </html>
  );
}
