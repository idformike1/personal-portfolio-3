'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import './globals.scss'
import SmoothScroll from '@/components/common/SmoothScroll'
import Preloader from '@/components/layout/Preloader'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function RootLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Basic cursor and scroll reset on mount
    document.body.style.cursor = 'default';
    window.scrollTo(0, 0);
  }, []);

  return (
    <html lang="en">
      <body>
        {isLoading ? (
          <Preloader finishLoading={() => setIsLoading(false)} />
        ) : (
          <SmoothScroll>
            <Navbar />
            <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              {children}
            </main>
            <Footer />
          </SmoothScroll>
        )}
      </body>
    </html>
  )
}
